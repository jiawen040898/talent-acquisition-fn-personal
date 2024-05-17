import { JobApplicationScoreType } from '@pulsifi/constants';
import { objectParser } from '@pulsifi/fn';
import { JobApplicationSkill } from '@pulsifi/interfaces';
import {
    JobApplication,
    JobApplicationCareer,
    JobApplicationQuestionnaire,
    JobApplicationResume,
    JobApplicationScore,
} from '@pulsifi/models';

import { JobApplicationCareerDto } from './job-application-career.dto';
import { JobApplicationQuestionnaireDto } from './job-application-questionnaire.dto';
import { JobApplicationResumeDto } from './job-application-resume.dto';

export class TalentAcquisitionApplicationSubmitted {
    job_application_id: string;
    company_id: number;
    job_id: string;
    role_fit_recipe_id?: string;
    culture_fit_recipe_id?: string;
    resume?: JobApplicationResumeDto;
    careers?: JobApplicationCareerDto[];
    assessments?: JobApplicationQuestionnaireDto[];

    constructor(
        jobApplication: JobApplication,
        newResume: JobApplicationResume | null,
        newCareers: JobApplicationCareer[],
        questionnaires: JobApplicationQuestionnaire[],
    ) {
        this.job_application_id = jobApplication.id;
        this.company_id = jobApplication.company_id;
        this.job_id = jobApplication.job_id;
        this.role_fit_recipe_id = jobApplication.job?.role_fit_recipe_id;
        this.culture_fit_recipe_id = jobApplication.job?.culture_fit_recipe_id;

        this.resume =
            objectParser.toDto(newResume, JobApplicationResumeDto) ?? undefined;

        //to ensure person fn to proceed to calculate fit score with careers with empty array
        this.careers = objectParser.toDtos(newCareers, JobApplicationCareerDto);

        this.assessments = objectParser.toDtos(
            questionnaires,
            JobApplicationQuestionnaireDto,
        );
    }
}

export class TalentAcquisitionAssessmentSubmitted {
    job_application_id: string;
    company_id: number;
    job_id: string;
    role_fit_recipe_id?: string;
    culture_fit_recipe_id?: string;
    assessment: JobApplicationQuestionnaireDto;

    constructor(
        jobApplication: JobApplication,
        questionnaire: JobApplicationQuestionnaire,
    ) {
        this.job_application_id = jobApplication.id;
        this.company_id = jobApplication.company_id;
        this.job_id = jobApplication.job_id;
        this.role_fit_recipe_id = jobApplication?.job?.role_fit_recipe_id;
        this.culture_fit_recipe_id = jobApplication.job?.culture_fit_recipe_id;

        this.assessment = new JobApplicationQuestionnaireDto(questionnaire);
    }
}

export class TalentAcquisitionApplicationRoleFitscoreCaptured {
    job_application_id: string;
    company_id: number;
    job_id: string;
    source?: string;
    ext_reference_id?: string;
    role_fit_recipe_id?: string;
    role_fit_score?: number | null;

    constructor(
        jobApplication: JobApplication,
        roleFitScore: JobApplicationScore,
    ) {
        this.job_application_id = jobApplication.id;
        this.company_id = jobApplication.company_id;
        this.job_id = jobApplication.job_id;
        this.source = jobApplication.source;
        this.ext_reference_id = jobApplication.ext_reference_id;
        this.role_fit_recipe_id =
            jobApplication?.job?.role_fit_recipe_id ??
            roleFitScore.score_recipe_id;
        this.role_fit_score = roleFitScore?.score;
    }
}

export class TalentAcquisitionApplicationCultureScoreCaptured {
    job_application_id: string;
    company_id: number;
    job_id: string;
    source?: string;
    ext_reference_id?: string;
    culture_fit_recipe_id?: string;
    culture_fit_score?: number | null;

    constructor(
        jobApplication: JobApplication,
        cultureScore: JobApplicationScore,
    ) {
        this.job_application_id = jobApplication.id;
        this.company_id = jobApplication.company_id;
        this.job_id = jobApplication.job_id;
        this.source = jobApplication.source;
        this.ext_reference_id = jobApplication.ext_reference_id;
        this.culture_fit_recipe_id =
            jobApplication?.job?.culture_fit_recipe_id ??
            cultureScore.score_recipe_id;
        this.culture_fit_score = cultureScore?.score;
    }
}

export class TalentAcquisitionApplicationUpdated {
    job_application_id: string;
    company_id: number;
    job_id: string;
    role_fit_recipe_id?: string;
    culture_fit_recipe_id?: string;
    skills?: string[];
    resume?: JobApplicationResumeDto;
    careers?: JobApplicationCareerDto[];

    constructor(
        jobApplication: JobApplication,
        newResume?: JobApplicationResume,
        newCareers?: JobApplicationCareer[],
    ) {
        this.job_application_id = jobApplication.id;
        this.company_id = jobApplication.company_id;
        this.job_id = jobApplication.job_id;
        this.role_fit_recipe_id = jobApplication?.job?.role_fit_recipe_id;
        this.culture_fit_recipe_id = jobApplication.job?.culture_fit_recipe_id;

        this.resume =
            objectParser.toDto(newResume, JobApplicationResumeDto) ?? undefined;

        this.careers = objectParser.toDtos(newCareers, JobApplicationCareerDto);
    }
}

export class TalentAcquisitionResumeAnalyzed {
    job_id: string;
    job_application_id: string;
    role_fit_recipe_id: string | null;
    skills: JobApplicationSkill[];

    constructor(
        jobId: string,
        jobApplicationId: string,
        roleFitRecipeId: string | null,
        skills: JobApplicationSkill[],
    ) {
        this.job_id = jobId;
        this.job_application_id = jobApplicationId;
        this.role_fit_recipe_id = roleFitRecipeId;
        this.skills = skills;
    }
}

export class ScoreData {
    score: number;
    score_type: JobApplicationScoreType;

    constructor(score: number, scoreType: JobApplicationScoreType) {
        this.score = score;
        this.score_type = scoreType;
    }
}

export class TalentAcquisitionScoreCalculated {
    job_id: string;
    job_application_id: string;
    job_application_scores: ScoreData[];
    role_fit_recipe_id?: string;
    culture_fit_recipe_id?: string;

    constructor(
        jobId: string,
        jobApplicationId: string,
        jobApplicationScores: ScoreData[],
        roleFitRecipeId?: string,
        cultureFitRecipeId?: string,
    ) {
        this.job_id = jobId;
        this.job_application_id = jobApplicationId;
        this.job_application_scores = jobApplicationScores;
        this.role_fit_recipe_id = roleFitRecipeId;
        this.culture_fit_recipe_id = cultureFitRecipeId;
    }
}

export type TalentAcquisitionPairWiseScoreCalculated =
    TalentAcquisitionScoreCalculated;
export type TalentAcquisitionAssessmentScoreCalculated =
    TalentAcquisitionScoreCalculated;
