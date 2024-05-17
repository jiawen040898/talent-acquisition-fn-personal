import { JobApplicationScoreType } from '@pulsifi/constants';
import { JobApplicationQuestionnaireDto } from '@pulsifi/dtos';
import { DomainTraitOutcome, logger } from '@pulsifi/fn';
import {
    AssessmentRawResult,
    CognitiveQuestionnaireFramework,
} from '@pulsifi/interfaces';
import { JobApplicationScoreMapper } from '@pulsifi/mappers';
import { JobApplicationScore } from '@pulsifi/models';
import { JobApplicationScoreUtil, QuestionnaireUtil } from '@pulsifi/shared';
import { sum } from 'lodash';
import { In } from 'typeorm';

import { getDataSource } from '../database';
import { JobApplicationScoreService } from './job-application-score.service';

const processCognitiveScore = (
    assessment: JobApplicationQuestionnaireDto,
    jobApplicationId: string,
    updatedBy: number,
    recipeId?: string,
): JobApplicationScore => {
    const scoreType =
        JobApplicationScoreMapper.mapCognitiveQuestionnaireFrameworkToScoreType[
            assessment.questionnaire_framework as CognitiveQuestionnaireFramework
        ];

    const alias =
        JobApplicationScoreMapper.mapCognitiveScoreTypeToAlias[scoreType];

    const { domain_score: domainScore, domain_alias: domainAlias } = (
        assessment?.result_raw as AssessmentRawResult
    ).scores?.find(
        (result) => result.domain_alias === alias,
    ) as DomainTraitOutcome;

    return JobApplicationScoreMapper.mapJobApplicationScore(
        JobApplicationScoreUtil.getFormattedJobApplicationScore(
            domainScore,
            scoreType,
        ),
        {
            cognitive_result: {
                domain_score: domainScore || 0,
                domain_alias: domainAlias,
                domain_percentile: null,
                ingredient_weightage: null,
            },
        },
        scoreType,
        JobApplicationScoreService.getScoreDimension(domainScore),
        jobApplicationId,
        updatedBy,
        recipeId,
    );
};

const processReasoningAverage = async (
    newScores: JobApplicationScore[],
    jobApplicationId: string,
    updatedBy: number,
    recipeId?: string,
): Promise<JobApplicationScore> => {
    const dataSource = await getDataSource();
    const existingScores = await dataSource
        .getRepository(JobApplicationScore)
        .find({
            where: {
                job_application_id: jobApplicationId,
                score_type: In([
                    JobApplicationScoreType.REASONING_LOGICAL,
                    JobApplicationScoreType.REASONING_NUMERIC,
                    JobApplicationScoreType.REASONING_VERBAL,
                ]),
            },
        });

    const newScoreTypes = newScores.map((score) => score.score_type);

    const filteredExistingScores = existingScores.filter(
        (score) => !newScoreTypes.includes(score.score_type),
    );

    const availableCognitiveScores = [...newScores, ...filteredExistingScores];

    const scores = availableCognitiveScores.map((s) =>
        JobApplicationScoreUtil.getOriginalDomainScore(
            s.score as number,
            s.score_type,
        ),
    );

    const reasoningAverageScore = sum(scores) / scores.length;

    return JobApplicationScoreMapper.mapJobApplicationScore(
        JobApplicationScoreUtil.getFormattedJobApplicationScore(
            reasoningAverageScore,
            JobApplicationScoreType.REASONING_AVG,
        ),
        {
            cognitive_result: {
                domain_score: reasoningAverageScore,
                domain_alias: JobApplicationScoreType.REASONING_AVG,
                domain_percentile: null,
                ingredient_weightage: null,
            },
        },
        JobApplicationScoreType.REASONING_AVG,
        JobApplicationScoreService.getScoreDimension(reasoningAverageScore),
        jobApplicationId,
        updatedBy,
        recipeId,
    );
};

const getCognitiveScores = async (
    assessments: JobApplicationQuestionnaireDto[],
    jobApplicationId: string,
    updatedBy: number,
    recipeId?: string,
): Promise<JobApplicationScore[]> => {
    try {
        const cognitiveScores = assessments.flatMap((assessment) => {
            if (!QuestionnaireUtil.isCognitiveQuestionnaire(assessment)) {
                return [];
            }

            return processCognitiveScore(
                assessment,
                jobApplicationId,
                updatedBy,
                recipeId,
            );
        });

        if (cognitiveScores.length === 0) {
            return [];
        }

        const reasoningAverage = await processReasoningAverage(
            cognitiveScores,
            jobApplicationId,
            updatedBy,
            recipeId,
        );

        return [...cognitiveScores, reasoningAverage];
    } catch (err) {
        logger.error('Failed to process cognitive score', {
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

export const CognitiveScoreService = {
    getCognitiveScores,
    processReasoningAverage,
    processCognitiveScore,
};
