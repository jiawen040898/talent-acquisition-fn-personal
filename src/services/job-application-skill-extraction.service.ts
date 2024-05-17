import { UnleashConfig } from '@pulsifi/configs';
import {
    FeatureToggleName,
    JobApplicationSkillProficiency,
    JobApplicationSkillSource,
    LambdaErrorMsg,
} from '@pulsifi/constants';
import {
    TalentAcquisitionApplicationSubmitted,
    TalentAcquisitionApplicationUpdated,
} from '@pulsifi/dtos';
import { JobApplicationSkill } from '@pulsifi/interfaces';
import { JobApplication } from '@pulsifi/models';
import AmazonS3URI from 'amazon-s3-uri';
import { uniqBy } from 'lodash';
import { PartialDaxtraS3 } from 'src/interfaces/daxtra-response.interface';
import { EntityManager } from 'typeorm';

import { getDataSource } from '../database';
import { FeatureToggleService } from './feature-toggle.service';
import { S3Service } from './s3.service';
import { SkillExtractAPIService } from './skill-extract-api.service';

type SkillMap = {
    [skillName: string]: JobApplicationSkill;
};

const extractJobApplicationSkills = async (
    updatedBy: number,
    jobApplicationPayload:
        | TalentAcquisitionApplicationSubmitted
        | TalentAcquisitionApplicationUpdated,
    manager?: EntityManager,
): Promise<void | JobApplicationSkill[]> => {
    let jobApplicationSkills: JobApplicationSkill[] = [];
    const dataSource = manager ?? (await getDataSource());

    const jobApplication = await dataSource
        .getRepository(JobApplication)
        .findOne({
            select: {
                id: true,
                skills: true,
                professional_summary: true,
                job: {
                    role_fit_recipe_id: true,
                },
            },
            where: {
                id: jobApplicationPayload.job_application_id,
            },
            relations: ['job', 'careers', 'educations'],
        });

    if (!jobApplication) {
        throw new Error(LambdaErrorMsg.INVALID_JOB_APPLICATION);
    }

    jobApplicationSkills = jobApplication.skills || [];
    const roleFitRecipeId = jobApplication.job?.role_fit_recipe_id ?? null;

    if (!jobApplicationPayload?.resume?.file_path || !roleFitRecipeId) {
        // do not parse skills if there is no resume or role fit recipe
        return;
    }

    const hasCandidateSkillSource = jobApplication.skills?.some(
        (skill) => skill.source === JobApplicationSkillSource.CANDIDATE,
    );

    const shouldGetSkillFromSkillExtractAPI = await shouldGetTextResumeSkill(
        jobApplicationPayload.company_id,
    );

    let daxtraSkills: JobApplicationSkill[] = [];
    let jobApplicationTextContent: string;
    if (
        !hasCandidateSkillSource &&
        jobApplicationPayload?.resume?.content_path
    ) {
        const parsedS3: PartialDaxtraS3 = await getPartialDaxtraS3(
            jobApplicationPayload.resume.content_path,
        );

        daxtraSkills = await getDaxtraSkill(parsedS3);
        jobApplicationTextContent = parsedS3.TextResume;
    } else {
        jobApplicationTextContent =
            prepareCandidateProfileTextContent(jobApplication);
    }

    const openAISkills = shouldGetSkillFromSkillExtractAPI
        ? await getOpenAIExtractedSkills(jobApplicationTextContent)
        : [];

    const hasAddedSkills = daxtraSkills.length > 0 || openAISkills.length > 0;

    jobApplicationSkills = uniqBy(
        [...jobApplicationSkills, ...openAISkills, ...daxtraSkills],
        (skill) => skill.name,
    );

    if (hasAddedSkills) {
        await dataSource.getRepository(JobApplication).update(
            {
                id: jobApplication.id,
            },
            {
                skills: jobApplicationSkills,
                updated_by: updatedBy,
            },
        );
    }

    return jobApplicationSkills;
};

const shouldGetTextResumeSkill = (companyId: number): Promise<boolean> => {
    const unleashContext: { [key: string]: string } = {
        environment: UnleashConfig().environment,
        companyId: companyId.toString(),
    };

    return FeatureToggleService.isUnleashFlagEnabled(
        FeatureToggleName.RESUME_ANALYZE,
        unleashContext,
    );
};

const getPartialDaxtraS3 = (contentPath: string): Promise<PartialDaxtraS3> => {
    const contentPathObj = AmazonS3URI(contentPath);
    const s3Service = new S3Service();

    return s3Service.getJsonFileFromS3(
        contentPathObj.bucket as string,
        contentPathObj.key as string,
    );
};

const getOpenAIExtractedSkills = async (
    textContent: string,
): Promise<JobApplicationSkill[]> => {
    const skillsFromSkillExtractAPI: SkillMap = {};

    const textResume = {
        TextResume: textContent,
    };
    const openAISkills = await SkillExtractAPIService.getOpenAISkills(
        textResume,
    );

    openAISkills?.competencies?.forEach((competency) => {
        skillsFromSkillExtractAPI[competency.skill.toLowerCase()] = {
            name: competency.skill,
            proficiency: null,
            source: JobApplicationSkillSource.OPENAI,
        };
    });

    return Object.values(skillsFromSkillExtractAPI);
};

const getDaxtraSkill = async (
    parsedS3: PartialDaxtraS3,
): Promise<JobApplicationSkill[]> => {
    const skillsFromDaxtra: SkillMap = {};

    const proficiencyMap: { [key: string]: JobApplicationSkillProficiency } = {
        EXCELLENT: JobApplicationSkillProficiency.EXPERT,
        GOOD: JobApplicationSkillProficiency.COMPETENT,
        BASIC: JobApplicationSkillProficiency.NOVICE,
    };

    const daxtraSkills = parsedS3.StructuredResume?.Competency || [];

    if (daxtraSkills.length === 0) {
        return [];
    }

    const daxtraSkillCondition1 = (
        auth: boolean,
        description: string,
    ): boolean => auth && description === 'Skill';

    const daxtraSkillCondition2 = (description: string): boolean =>
        description.toLowerCase() === 'skill > language';

    daxtraSkills.forEach((skill) => {
        if (daxtraSkillCondition1(skill.auth, skill.description)) {
            skillsFromDaxtra[skill.skillName.toLowerCase()] = {
                name: skill.skillName,
                proficiency: skill.skillProficiency
                    ? proficiencyMap[skill.skillProficiency]
                    : null,
                source: JobApplicationSkillSource.DAXTRA,
            };
        }

        if (daxtraSkillCondition2(skill.description)) {
            const processedSkillName = skill.skillName.split('>').at(-1);

            skillsFromDaxtra[processedSkillName.toLowerCase()] = {
                name: processedSkillName,
                proficiency: skill.skillProficiency
                    ? proficiencyMap[skill.skillProficiency]
                    : null,
                source: JobApplicationSkillSource.DAXTRA,
            };
        }
    });

    return Object.values(skillsFromDaxtra);
};

const prepareCandidateProfileTextContent = (
    jobApplication: JobApplication,
): string => {
    const content = {
        professional_summary: jobApplication.professional_summary,
        careers: jobApplication.careers,
        educations: jobApplication.educations,
    };

    return JSON.stringify(JSON.stringify(content));
};

export const JobApplicationSkillExtractionService = {
    extractJobApplicationSkills,
};
