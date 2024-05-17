import {
    FitScoreRecipesDto,
    InterestRiasecDto,
    InterestRiasecOutcomeDto,
    JobApplicationQuestionnaireDto,
} from '@pulsifi/dtos';
import {
    computationService,
    DomainOutcome,
    IngredientGroup,
    logger,
} from '@pulsifi/fn';
import {
    AssessmentRawResult,
    PersonalityDomainOutcomeDto,
} from '@pulsifi/interfaces';
import { JobApplicationScoreMapper } from '@pulsifi/mappers';
import { JobApplicationScore } from '@pulsifi/models';
import { JobApplicationScoreUtil } from '@pulsifi/shared';
import { map } from 'lodash';

import {
    JobApplicationScoreType,
    PersonalityOutcomeDomainAlias,
    QuestionnaireFramework,
} from '../constants';
import { JobApplicationScoreService } from './job-application-score.service';

const transformDomainOutcome = (
    domainOutcome: DomainOutcome,
): PersonalityDomainOutcomeDto => {
    return {
        ...domainOutcome,
        domain_weightage: domainOutcome.domain_weightage ?? null,
        traits: [],
    };
};

const getWorkStyleScoreOutcome = (
    assessment: JobApplicationQuestionnaireDto,
    jobApplicationId: string,
    updatedBy: number,
    recipeId?: string,
    fitScoreRecipe?: FitScoreRecipesDto,
): JobApplicationScore => {
    const transformedWorkStyle =
        computationService.transformPersonalityToWorkStyle(
            (assessment.result_raw as AssessmentRawResult)?.scores ?? [],
        );

    if (!fitScoreRecipe) {
        return JobApplicationScoreMapper.mapJobApplicationScore(
            null,
            {
                personality_result: transformedWorkStyle.map(
                    transformDomainOutcome,
                ),
            },
            JobApplicationScoreType.WORK_STYLE,
            0,
            jobApplicationId,
            updatedBy,
            recipeId,
        );
    }

    const { score, domainScores } = computationService.computeIngredientScore(
        transformedWorkStyle,
        fitScoreRecipe.recipe,
        IngredientGroup.WORK_STYLE,
    );

    return JobApplicationScoreMapper.mapJobApplicationScore(
        JobApplicationScoreUtil.getFormattedJobApplicationScore(
            score,
            JobApplicationScoreType.WORK_STYLE,
        ),
        {
            personality_result: domainScores.map(transformDomainOutcome),
        },
        JobApplicationScoreType.WORK_STYLE,
        JobApplicationScoreService.getScoreDimension(score),
        jobApplicationId,
        updatedBy,
        recipeId,
    );
};

const getWorkValueScoreOutcome = (
    assessment: JobApplicationQuestionnaireDto,
    jobApplicationId: string,
    updatedBy: number,
    recipeId?: string,
    fitScoreRecipe?: FitScoreRecipesDto,
): JobApplicationScore => {
    const transformedWorkValue =
        computationService.transformOrgValueToWorkValue(
            (assessment.result_raw as AssessmentRawResult)?.scores ?? [],
        );

    if (!fitScoreRecipe) {
        return JobApplicationScoreMapper.mapJobApplicationScore(
            null,
            {
                personality_result: transformedWorkValue.map(
                    transformDomainOutcome,
                ),
            },
            JobApplicationScoreType.WORK_VALUE,
            0,
            jobApplicationId,
            updatedBy,
            recipeId,
        );
    }

    const { score, domainScores } = computationService.computeIngredientScore(
        transformedWorkValue,
        fitScoreRecipe.recipe,
        IngredientGroup.WORK_VALUE,
    );

    return JobApplicationScoreMapper.mapJobApplicationScore(
        JobApplicationScoreUtil.getFormattedJobApplicationScore(
            score,
            JobApplicationScoreType.WORK_VALUE,
        ),
        {
            personality_result: domainScores.map(transformDomainOutcome),
        },
        JobApplicationScoreType.WORK_VALUE,
        JobApplicationScoreService.getScoreDimension(score),
        jobApplicationId,
        updatedBy,
        recipeId,
    );
};

const mapInterestRiasecOutcome = (
    outcomeScores: InterestRiasecOutcomeDto[],
): InterestRiasecDto => {
    return {
        domain_alias: '',
        domain_score: -1,
        ingredient_weightage: -1,
        outcome: outcomeScores,
        job_codes: undefined,
        person_codes: undefined,
    };
};

const getWorkInterestScoreOutcome = (
    assessment: JobApplicationQuestionnaireDto,
    jobApplicationId: string,
    updatedBy: number,
    recipeId?: string,
    fitScoreRecipe?: FitScoreRecipesDto,
): JobApplicationScore => {
    const resultRaw =
        (assessment.result_raw as AssessmentRawResult)?.scores ?? [];

    const transformedWorkInterest =
        computationService.transformWorkInterestScores(resultRaw);

    const hasInterestRiasecInIngredientAlias = fitScoreRecipe?.recipe.some(
        (recipe) =>
            recipe.ingredient_alias ===
            PersonalityOutcomeDomainAlias.INTEREST_RIASEC,
    );

    if (!fitScoreRecipe || !hasInterestRiasecInIngredientAlias) {
        return JobApplicationScoreMapper.mapJobApplicationScore(
            null,
            {
                personality_result: map(
                    transformedWorkInterest,
                    (score, alias) =>
                        ({
                            domain_alias: alias,
                            domain_score: score,
                        } as InterestRiasecOutcomeDto),
                ),
            },
            JobApplicationScoreType.WORK_INTEREST,
            0,
            jobApplicationId,
            updatedBy,
            recipeId,
        );
    }

    const jobRiasecCode =
        fitScoreRecipe.recipe
            .find(
                (recipe) =>
                    recipe.ingredient_alias ===
                    PersonalityOutcomeDomainAlias.INTEREST_RIASEC,
            )
            ?.ingredient_attribute?.split(',') || [];

    const workInterestScore = computationService.computeWorkInterestScore(
        jobRiasecCode,
        transformedWorkInterest,
    );

    const workInterestDomainOutcome = map(
        transformedWorkInterest,
        (score, alias) => ({
            domain_alias: alias,
            domain_score: score,
        }),
    );

    const employeeRiasecCode =
        computationService.transformDomainScoresToPersonRiasecCode(resultRaw);

    return JobApplicationScoreMapper.mapJobApplicationScore(
        JobApplicationScoreUtil.getFormattedJobApplicationScore(
            workInterestScore,
            JobApplicationScoreType.WORK_INTEREST,
        ),
        {
            person_codes: employeeRiasecCode,
            job_codes: jobRiasecCode,
            personality_result: workInterestDomainOutcome,
        },
        JobApplicationScoreType.WORK_INTEREST,
        JobApplicationScoreService.getScoreDimension(workInterestScore),
        jobApplicationId,
        updatedBy,
        recipeId,
    );
};

const getPersonalityScores = (
    assessments: JobApplicationQuestionnaireDto[],
    jobApplicationId: string,
    updatedBy: number,
    recipeId?: string,
    fitScoreRecipe?: FitScoreRecipesDto,
): JobApplicationScore[] => {
    try {
        return assessments.flatMap<
            JobApplicationScore,
            JobApplicationQuestionnaireDto[]
        >((assessment) => {
            const frameworkType =
                assessment.questionnaire_framework as QuestionnaireFramework;

            switch (frameworkType) {
                case QuestionnaireFramework.PERSONALITY:
                    return getWorkStyleScoreOutcome(
                        assessment,
                        jobApplicationId,
                        updatedBy,
                        recipeId,
                        fitScoreRecipe,
                    );

                case QuestionnaireFramework.WORK_VALUE:
                    return getWorkValueScoreOutcome(
                        assessment,
                        jobApplicationId,
                        updatedBy,
                        recipeId,
                        fitScoreRecipe,
                    );

                case QuestionnaireFramework.WORK_INTEREST:
                    return getWorkInterestScoreOutcome(
                        assessment,
                        jobApplicationId,
                        updatedBy,
                        recipeId,
                        fitScoreRecipe,
                    );

                default:
                    return [];
            }
        });
    } catch (err) {
        logger.error('Failed to process personality score', {
            data: {
                assessments,
                job_application_id: jobApplicationId,
                recipe_id: recipeId,
            },
            err,
        });
        throw err;
    }
};

export const PersonalityScoreService = {
    getPersonalityScores,
    getWorkStyleScoreOutcome,
    getWorkValueScoreOutcome,
    getWorkInterestScoreOutcome,
    transformDomainOutcome,
    mapInterestRiasecOutcome,
};
