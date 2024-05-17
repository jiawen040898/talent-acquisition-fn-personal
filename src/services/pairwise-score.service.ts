import { JobApplicationScoreType } from '@pulsifi/constants';
import {
    FitScoreRecipesDto,
    PairwiseSkillDto,
    PairwiseTitleDto,
} from '@pulsifi/dtos';
import { JobApplicationSkill } from '@pulsifi/interfaces';
import { JobApplicationScoreMapper } from '@pulsifi/mappers';
import { JobApplicationCareer, JobApplicationScore } from '@pulsifi/models';
import { JobApplicationScoreUtil } from '@pulsifi/shared';
import { map, trim } from 'lodash';
import { EntityManager } from 'typeorm';

import { getDataSource } from '../database';
import { DSLookupService } from './ds-lookup.service';
import {
    JobApplicationScoreService,
    SkillSource,
} from './job-application-score.service';

const SKILL_MATCH_THRESHOLD = 0.75;

const processPairwiseSkillOutput = async (
    jobInfo: string[],
    jobApplicationInfo: string[],
    scoreType:
        | JobApplicationScoreType.HARD_SKILL
        | JobApplicationScoreType.WORK_EXP,
): Promise<{
    pairwiseScore: number;
    pairwiseOutcome: PairwiseSkillDto[] | PairwiseTitleDto[];
}> => {
    const hasJobInfo = jobInfo.length > 0;
    const hasJobApplicationInfo = jobApplicationInfo.length > 0;

    /**
     * If job have no required skills, the pairwise score is always full score
     */
    if (!hasJobInfo) {
        return {
            pairwiseScore: 1,
            pairwiseOutcome: [],
        };
    }

    /**
     * If job have required skills but job application does not provide relevant info
     * pairwise score will always be 0
     */
    if (!hasJobApplicationInfo) {
        return {
            pairwiseScore: 0,
            pairwiseOutcome: [],
        };
    }

    const pairwiseOutput = await DSLookupService.getPairwiseSimilarity(
        jobInfo,
        jobApplicationInfo,
    );

    const pairwiseList = pairwiseOutput?.pairwise_score;

    switch (scoreType) {
        case JobApplicationScoreType.HARD_SKILL:
            return {
                pairwiseScore: pairwiseOutput?.score ?? 0,
                pairwiseOutcome: map(pairwiseList, (value, skillName) => ({
                    skill_name: skillName,
                    matches: map(value, (score, skillName) => ({
                        skill_name: trim(skillName),
                        score,
                    })),
                })) as PairwiseSkillDto[],
            };

        case JobApplicationScoreType.WORK_EXP:
            return {
                pairwiseScore: pairwiseOutput?.score ?? 0,
                pairwiseOutcome: map(pairwiseList, (value, title) => ({
                    previous_employment: title,
                    matches: map(value, (score, jobTitle) => ({
                        job_title: trim(jobTitle),
                        score,
                    })),
                })) as PairwiseTitleDto[],
            };
    }
};

const pairwiseSkillMapper = (
    pairwiseOutcome: PairwiseSkillDto[],
    skillsSource: SkillSource,
): PairwiseSkillDto[] => {
    return pairwiseOutcome.map((value) => {
        const isSkillNameMatched = skillsSource.hasOwnProperty(
            value.skill_name,
        );

        return {
            ...value,
            matches: value.matches.map((match) => ({
                ...match,
                match: match.score >= SKILL_MATCH_THRESHOLD,
                ...(isSkillNameMatched && {
                    source: skillsSource[value.skill_name].source,
                }),
            })),
        };
    });
};

const getHardSkillJobApplicationScore = async (
    jobApplicationSkills: JobApplicationSkill[],
    fitScoreRecipe: FitScoreRecipesDto,
    fitScoreRecipeId: string,
    jobApplicationId: string,
    updatedBy: number,
): Promise<JobApplicationScore> => {
    const skills = jobApplicationSkills.map((skill) => skill.name);
    const skillsSource: SkillSource = {};
    const scoreType = JobApplicationScoreType.HARD_SKILL;

    jobApplicationSkills.forEach((skill) => {
        skillsSource[skill.name] = skill;
    });

    const { pairwiseScore, pairwiseOutcome } = await processPairwiseSkillOutput(
        fitScoreRecipe.job_competency ?? [],
        skills ?? [],
        scoreType,
    );

    const updatedSkillMatch = pairwiseSkillMapper(
        pairwiseOutcome as PairwiseSkillDto[],
        skillsSource,
    );

    return JobApplicationScoreMapper.mapJobApplicationScore(
        JobApplicationScoreUtil.getFormattedJobApplicationScore(
            pairwiseScore,
            scoreType,
        ),
        {
            pairwise_result: updatedSkillMatch,
        },
        scoreType,
        JobApplicationScoreService.getScoreDimension(pairwiseScore),
        jobApplicationId,
        updatedBy,
        fitScoreRecipeId,
    );
};

const validateFitScoreRecipeHasJobTitle = (
    fitScoreRecipe: FitScoreRecipesDto,
    recipeId: string,
) => {
    if (!fitScoreRecipe?.job_title) {
        throw new Error(
            `Phase 1 Fit Score Comparison. Missing job title in fit score recipe, recipe id: ${recipeId}`,
        );
    }
};

const getWorkExpJobApplicationScore = async (
    jobApplicationId: string,
    fitScoreRecipe: FitScoreRecipesDto,
    fitScoreRecipeId: string,
    updatedBy: number,
    manager?: EntityManager,
): Promise<JobApplicationScore> => {
    validateFitScoreRecipeHasJobTitle(fitScoreRecipe, fitScoreRecipe.id);

    const scoreType = JobApplicationScoreType.WORK_EXP;
    const dataSource = manager ?? (await getDataSource());

    const jobApplicationCareers = await dataSource
        .getRepository(JobApplicationCareer)
        .find({
            select: ['role'],
            where: {
                job_application_id: jobApplicationId,
            },
        });

    const jobApplicationRoles = jobApplicationCareers.map((career) => {
        return career.role;
    });

    const { pairwiseScore, pairwiseOutcome } = await processPairwiseSkillOutput(
        [fitScoreRecipe.job_title as string],
        jobApplicationRoles,
        scoreType,
    );

    return JobApplicationScoreMapper.mapJobApplicationScore(
        JobApplicationScoreUtil.getFormattedJobApplicationScore(
            pairwiseScore,
            scoreType,
        ),
        {
            pairwise_result: pairwiseOutcome,
        },
        scoreType,
        JobApplicationScoreService.getScoreDimension(pairwiseScore),
        jobApplicationId,
        updatedBy,
        fitScoreRecipeId,
    );
};

export const PairwiseScoreService = {
    getHardSkillJobApplicationScore,
    getWorkExpJobApplicationScore,
    processPairwiseSkillOutput,
    pairwiseSkillMapper,
};
