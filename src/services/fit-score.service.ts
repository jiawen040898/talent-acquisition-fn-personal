import {
    FrameworkType,
    INGREDIENT_SCORE_AND_WEIGHTAGE_ADJUSTMENT_STEPS,
    IngredientFramework,
    JobApplicationScoreType,
    PersonalityCognitiveScoreDomainAlias,
} from '@pulsifi/constants';
import { FitScoreRecipesDto, Ingredient } from '@pulsifi/dtos';
import { computationService, DomainOutcome, logger } from '@pulsifi/fn';
import {
    CognitiveScoreOutcomePayload,
    PersonalityScoreOutcomePayload,
} from '@pulsifi/interfaces';
import { JobApplicationScoreMapper } from '@pulsifi/mappers';
import { JobApplicationScore } from '@pulsifi/models';
import {
    JobApplicationScoreUtil,
    NumberDistributionUtils,
} from '@pulsifi/shared';
import { omit, uniq } from 'lodash';

import { JobApplicationScoreService } from './job-application-score.service';

const getIngredientFromRecipe = (recipe: FitScoreRecipesDto): Ingredient[] => {
    const scoreType = recipe.fit_score_type;

    if (scoreType === FrameworkType.CULTURE_FIT) {
        return recipe.recipe.filter(
            (item) => item.ingredient_group !== 'recipe',
        );
    } else if (scoreType === FrameworkType.ROLE_FIT) {
        return recipe.recipe.filter(
            (item) => item.ingredient_group === 'recipe',
        );
    } else {
        return [];
    }
};

const hasAllRequiredScoresForCalculation = (
    fitScoreRecipe: FitScoreRecipesDto,
    jobApplicationScores: JobApplicationScore[],
): boolean => {
    const ingredients = uniq(getIngredientFromRecipe(fitScoreRecipe));

    const ingredientsFrameworks: Record<string, Ingredient[]> = {};
    ingredients.forEach((ingredient) => {
        if (!ingredient.ingredient_framework) {
            return;
        }

        ingredientsFrameworks[ingredient.ingredient_framework] ??= [];

        ingredientsFrameworks[ingredient.ingredient_framework].push(ingredient);
    });

    const scoreTypes = jobApplicationScores.map((score) => {
        return score.score_type;
    });

    const frameworkList = Object.keys(ingredientsFrameworks);

    const requiredScoreTypes = frameworkList.flatMap((framework) => {
        if (framework !== IngredientFramework.PULSIFI_DEFAULT) {
            return framework;
        } else {
            const uniqueAlias = new Set(
                ingredientsFrameworks[IngredientFramework.PULSIFI_DEFAULT].map(
                    (item) => {
                        return JobApplicationScoreMapper.mapIngredientAliasToScoreType(
                            item.ingredient_alias,
                        );
                    },
                ),
            );

            return [...uniqueAlias];
        }
    });

    return requiredScoreTypes.every((requiredScoreType) =>
        scoreTypes.includes(requiredScoreType as JobApplicationScoreType),
    );
};

const mapRoleFitDomainScores = (
    jobApplicationScores: JobApplicationScore[],
): DomainOutcome[] => {
    const applicableScoreTypes = [
        JobApplicationScoreType.REASONING_LOGICAL,
        JobApplicationScoreType.REASONING_NUMERIC,
        JobApplicationScoreType.REASONING_VERBAL,
        JobApplicationScoreType.WORK_STYLE,
        JobApplicationScoreType.WORK_VALUE,
        JobApplicationScoreType.WORK_INTEREST,
        JobApplicationScoreType.HARD_SKILL,
        JobApplicationScoreType.WORK_EXP,
    ];

    return jobApplicationScores.flatMap((jobApplicationScore) => {
        const { score_type: scoreType, score } = jobApplicationScore;

        if (!applicableScoreTypes.includes(scoreType)) {
            return [];
        }

        return {
            domain_alias:
                JobApplicationScoreMapper.mapScoreTypeToIngredientAlias(
                    scoreType,
                ),
            domain_score: JobApplicationScoreUtil.getOriginalDomainScore(
                score ?? 0,
                scoreType,
            ),
        };
    });
};

const getRoleFitJobApplicationScore = (
    jobApplicationScores: JobApplicationScore[],
    fitScoreRecipe: FitScoreRecipesDto,
    fitScoreRecipeId: string,
    jobApplicationId: string,
    updatedBy: number,
): JobApplicationScore | undefined => {
    if (
        !hasAllRequiredScoresForCalculation(
            fitScoreRecipe,
            jobApplicationScores,
        )
    ) {
        logger.info(
            `Not all required scores are present for role_fit score calculation`,
            { jobApplicationId, fitScoreRecipeId },
        );
        return;
    }

    const processedDomainScores: DomainOutcome[] =
        mapRoleFitDomainScores(jobApplicationScores);

    const { score, ingredientScores } = computationService.computeRoleFitScore(
        processedDomainScores,
        fitScoreRecipe.recipe,
    );

    const distributedIngredientScoresWithRoundingAdjustment =
        NumberDistributionUtils.distributeRoleFitIngredientScore(
            ingredientScores,
            INGREDIENT_SCORE_AND_WEIGHTAGE_ADJUSTMENT_STEPS,
        );

    const ingredientScoresWithRoundingAdjustment =
        distributedIngredientScoresWithRoundingAdjustment.map((score) => ({
            ...omit(score, ['ingredient_weighted_score']),
        }));

    return JobApplicationScoreMapper.mapJobApplicationScore(
        JobApplicationScoreUtil.getFormattedJobApplicationScore(
            score,
            JobApplicationScoreType.ROLE_FIT,
        ),
        {
            ingredient_result: ingredientScoresWithRoundingAdjustment,
        },
        JobApplicationScoreType.ROLE_FIT,
        JobApplicationScoreService.getScoreDimension(score),
        jobApplicationId,
        updatedBy,
        fitScoreRecipeId,
    );
};

const mapCognitiveScoreType = (
    personalityScoreType: PersonalityCognitiveScoreDomainAlias,
): JobApplicationScoreType => {
    switch (personalityScoreType) {
        case PersonalityCognitiveScoreDomainAlias.LOGICAL:
            return JobApplicationScoreType.REASONING_LOGICAL;

        case PersonalityCognitiveScoreDomainAlias.NUMERIC:
            return JobApplicationScoreType.REASONING_NUMERIC;

        case PersonalityCognitiveScoreDomainAlias.VERBAL:
            return JobApplicationScoreType.REASONING_VERBAL;

        case PersonalityCognitiveScoreDomainAlias.REASONING_AVG:
            return JobApplicationScoreType.REASONING_AVG;
        default:
            logger.error('No cognitive score type found.', {
                data: personalityScoreType,
            });
            throw new Error('No cognitive score type found.');
    }
};

const mapCultureFitDomainScore = (
    jobApplicationScores: JobApplicationScore[],
): DomainOutcome[] => {
    return jobApplicationScores.flatMap((jobApplicationScore) => {
        const { score_type: scoreType, score_outcome: scoreOutcome } =
            jobApplicationScore;

        switch (scoreType) {
            case JobApplicationScoreType.WORK_VALUE:
            case JobApplicationScoreType.WORK_STYLE:
            case JobApplicationScoreType.WORK_INTEREST:
                const personalityScoreOutcome =
                    scoreOutcome as PersonalityScoreOutcomePayload;

                return personalityScoreOutcome?.personality_result?.map(
                    (result) => ({
                        domain_alias: result.domain_alias,
                        domain_score: result.domain_score,
                        domain_framework: scoreType,
                    }),
                ) as SafeAny;

            case JobApplicationScoreType.REASONING_LOGICAL:
            case JobApplicationScoreType.REASONING_NUMERIC:
            case JobApplicationScoreType.REASONING_VERBAL:
                const cognitiveScoreOutcome =
                    scoreOutcome as CognitiveScoreOutcomePayload;

                return {
                    domain_alias: mapCognitiveScoreType(
                        cognitiveScoreOutcome?.cognitive_result
                            ?.domain_alias as PersonalityCognitiveScoreDomainAlias,
                    ),
                    domain_score:
                        cognitiveScoreOutcome?.cognitive_result?.domain_score,
                };
            default:
                return [];
        }
    });
};

const getCultureFitJobApplicationScore = (
    jobApplicationScores: JobApplicationScore[],
    fitScoreRecipe: FitScoreRecipesDto,
    fitScoreRecipeId: string,
    jobApplicationId: string,
    updatedBy: number,
): JobApplicationScore | undefined => {
    if (
        !hasAllRequiredScoresForCalculation(
            fitScoreRecipe,
            jobApplicationScores,
        )
    ) {
        logger.info(
            `Not all required scores are present for culture_fit score calculation`,
            { jobApplicationId, fitScoreRecipeId },
        );
        return;
    }

    const processedDomainScores: DomainOutcome[] =
        mapCultureFitDomainScore(jobApplicationScores);

    const { score, domainScores } = computationService.computeCultureFitScore(
        processedDomainScores,
        fitScoreRecipe.recipe,
    );

    return JobApplicationScoreMapper.mapJobApplicationScore(
        JobApplicationScoreUtil.getFormattedJobApplicationScore(
            score,
            JobApplicationScoreType.CULTURE_FIT,
        ),
        {
            personality_result: domainScores,
            framework_alias: fitScoreRecipe.framework_alias,
        },
        JobApplicationScoreType.CULTURE_FIT,
        JobApplicationScoreService.getScoreDimension(score),
        jobApplicationId,
        updatedBy,
        fitScoreRecipeId,
    );
};

export const FitScoreService = {
    mapRoleFitDomainScores,
    getRoleFitJobApplicationScore,
    mapCognitiveScoreType,
    mapCultureFitDomainScore,
    getCultureFitJobApplicationScore,
    hasAllRequiredScoresForCalculation,
};
