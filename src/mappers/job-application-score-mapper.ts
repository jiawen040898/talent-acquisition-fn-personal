import {
    JobApplicationScoreType,
    PersonalityCognitiveScoreDomainAlias,
    PersonalityOutcomeDomainAlias,
    PersonalityPairwiseSkillAlias,
    QuestionnaireFramework,
} from '@pulsifi/constants';
import { logger } from '@pulsifi/fn';
import {
    CognitiveDomainAlias,
    CognitiveQuestionnaireFramework,
    CognitiveScoreType,
    JobApplicationScoreOutcome,
} from '@pulsifi/interfaces';
import { JobApplicationScore } from '@pulsifi/models';

const mapCognitiveQuestionnaireFrameworkToScoreType: {
    [K in CognitiveQuestionnaireFramework]: CognitiveScoreType;
} = {
    [QuestionnaireFramework.REASONING_NUMERIC]:
        JobApplicationScoreType.REASONING_NUMERIC,
    [QuestionnaireFramework.REASONING_LOGIC]:
        JobApplicationScoreType.REASONING_LOGICAL,
    [QuestionnaireFramework.REASONING_VERBAL]:
        JobApplicationScoreType.REASONING_VERBAL,
};

const mapCognitiveScoreTypeToAlias: {
    [K in CognitiveScoreType]: CognitiveDomainAlias;
} = {
    [JobApplicationScoreType.REASONING_NUMERIC]:
        PersonalityCognitiveScoreDomainAlias.NUMERIC,
    [JobApplicationScoreType.REASONING_LOGICAL]:
        PersonalityCognitiveScoreDomainAlias.LOGICAL,
    [JobApplicationScoreType.REASONING_VERBAL]:
        PersonalityCognitiveScoreDomainAlias.VERBAL,
};

const mapIngredientAliasToScoreType = (
    ingredientAlias: string,
): JobApplicationScoreType => {
    switch (ingredientAlias) {
        case PersonalityOutcomeDomainAlias.INTEREST_RIASEC:
            return JobApplicationScoreType.WORK_INTEREST;
        case PersonalityPairwiseSkillAlias.HARD_SKILLS:
            return JobApplicationScoreType.HARD_SKILL;
        default:
            return ingredientAlias as JobApplicationScoreType;
    }
};

const mapScoreTypeToIngredientAlias = (
    scoreType: JobApplicationScoreType,
): string => {
    switch (scoreType) {
        case JobApplicationScoreType.WORK_INTEREST:
            return PersonalityOutcomeDomainAlias.INTEREST_RIASEC;
        case JobApplicationScoreType.HARD_SKILL:
            return PersonalityPairwiseSkillAlias.HARD_SKILLS;
        default:
            return scoreType;
    }
};

const mapCognitiveScoreType = (
    personalityScoreType: PersonalityCognitiveScoreDomainAlias,
): JobApplicationScoreType => {
    let scoreType = null;
    switch (personalityScoreType) {
        case PersonalityCognitiveScoreDomainAlias.LOGICAL:
            scoreType = JobApplicationScoreType.REASONING_LOGICAL;
            break;

        case PersonalityCognitiveScoreDomainAlias.NUMERIC:
            scoreType = JobApplicationScoreType.REASONING_NUMERIC;
            break;

        case PersonalityCognitiveScoreDomainAlias.VERBAL:
            scoreType = JobApplicationScoreType.REASONING_VERBAL;
            break;

        case PersonalityCognitiveScoreDomainAlias.REASONING_AVG:
            scoreType = JobApplicationScoreType.REASONING_AVG;
            break;
        default:
            logger.error('No employee cognitive score type found.', {
                data: personalityScoreType,
            });
            throw new Error('No employee cognitive score type found.');
    }

    return scoreType;
};

const mapJobApplicationScore = (
    score: number | null,
    scoreOutcome: JobApplicationScoreOutcome,
    scoreType: JobApplicationScoreType,
    scoreDimension: number,
    jobApplicationId: string,
    updatedBy: number,
    recipeId?: string,
): JobApplicationScore => {
    return {
        score,
        score_outcome: scoreOutcome,
        score_type: scoreType,
        score_dimension: scoreDimension,
        job_application_id: jobApplicationId,
        score_recipe_id: recipeId,
        created_by: updatedBy,
        updated_by: updatedBy,
    };
};

export const JobApplicationScoreMapper = {
    mapCognitiveScoreType,
    mapJobApplicationScore,
    mapCognitiveQuestionnaireFrameworkToScoreType,
    mapCognitiveScoreTypeToAlias,
    mapIngredientAliasToScoreType,
    mapScoreTypeToIngredientAlias,
};
