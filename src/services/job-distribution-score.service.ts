import { JobApplicationScoreType } from '@pulsifi/constants';
import { ScoreData } from '@pulsifi/dtos';
import { logger } from '@pulsifi/fn';
import { JobDistributionScore } from '@pulsifi/models';
import { JobApplicationScoreUtil } from '@pulsifi/shared';
import { EntityManager } from 'typeorm';

import { getDataSource } from '../database';
import { BetaDistributionService } from './beta-distribution.service';

const getLatestMeanVariance = (
    distributionScore: JobDistributionScore,
    score: number,
): { mean: number; variance: number; alpha: number; beta: number } => {
    if (score > 1 || score < 0) {
        // this should only happen when some ingredient weightages are negative values
        logger.warn('Score is not within range [0, 1]', { score });
    }

    const newMean = BetaDistributionService.getNewMean(
        distributionScore.mean,
        score,
    );

    const newVariance = BetaDistributionService.getNewVariance(
        distributionScore.variance,
        distributionScore.mean,
        newMean,
        score,
    );

    const { alpha, beta } = BetaDistributionService.getAlphaAndBeta(
        newMean,
        newVariance,
        distributionScore.size,
    );

    return { mean: newMean, variance: newVariance, alpha, beta };
};

const shouldUpdateJobDistributionScore = (
    scoreType: JobApplicationScoreType,
): boolean => {
    return [
        JobApplicationScoreType.REASONING_NUMERIC,
        JobApplicationScoreType.REASONING_LOGICAL,
        JobApplicationScoreType.REASONING_VERBAL,
        JobApplicationScoreType.REASONING_AVG,
        JobApplicationScoreType.WORK_STYLE,
        JobApplicationScoreType.WORK_VALUE,
    ].includes(scoreType);
};

const updateJobDistributionScore = async (
    jobId: string,
    jobApplicationScore: ScoreData,
    manager?: EntityManager,
): Promise<void> => {
    if (!shouldUpdateJobDistributionScore(jobApplicationScore.score_type)) {
        logger.info(
            `Ignoring score type ${jobApplicationScore.score_type} for job distribution score`,
        );
        return;
    }

    const dataSource = manager ?? (await getDataSource());

    const JobDistributionScoreRepo =
        dataSource.getRepository(JobDistributionScore);

    const distributionScore = await JobDistributionScoreRepo.findOneOrFail({
        where: {
            job_id: jobId,
            score_type: jobApplicationScore.score_type,
        },
    });

    const { mean, variance, alpha, beta } =
        JobDistributionScoreService.getLatestMeanVariance(
            distributionScore,
            JobApplicationScoreUtil.getOriginalDomainScore(
                jobApplicationScore.score,
                jobApplicationScore.score_type,
            ),
        );

    await JobDistributionScoreRepo.update(distributionScore.id, {
        mean: mean,
        variance: variance,
        alpha,
        beta,
        size: distributionScore.size + 1,
    });

    logger.info('Distribution score updated', {
        jobId,
        scoreType: jobApplicationScore.score_type,
    });
};
export const JobDistributionScoreService = {
    updateJobDistributionScore,
    getLatestMeanVariance,
};
