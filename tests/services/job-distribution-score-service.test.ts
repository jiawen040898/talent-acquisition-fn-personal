import { ScoreData } from '@pulsifi/dtos';
import { JobDistributionScore } from '@pulsifi/models';
import { JobDistributionScoreService } from '@pulsifi/services';
import {
    reasoningLogicalScore,
    workExperienceScore,
    workStyleScore,
} from '@pulsifi/tests/fixtures/job-application-score/test-data';
import {
    reasoningLogicalDistribution,
    workStyleDistribution,
} from '@pulsifi/tests/fixtures/job-distribution-score/test-data';
import { getTestDataSource } from '@pulsifi/tests/setup';
import { DataSource, Repository } from 'typeorm';

import { setDataSource } from '../../src/database';

const spyGetLatestMeanVariance = jest.spyOn(
    JobDistributionScoreService,
    'getLatestMeanVariance',
);

describe('JobDistributionScoreService', () => {
    let dataSource: DataSource;
    let jobDistributionScoreRepo: Repository<JobDistributionScore>;

    beforeAll(async () => {
        dataSource = await getTestDataSource();
        jobDistributionScoreRepo =
            dataSource.getRepository(JobDistributionScore);

        setDataSource(dataSource);

        await jobDistributionScoreRepo.save([
            workStyleDistribution,
            reasoningLogicalDistribution,
        ]);
    });

    describe('updateJobDistributionScore', () => {
        describe('when score type is work style', () => {
            beforeAll(async () => {
                // Arrange
                jest.clearAllMocks();

                // Act
                await JobDistributionScoreService.updateJobDistributionScore(
                    workStyleDistribution.job_id,
                    workStyleScore as ScoreData,
                );
            });

            it('should call getLatestMeanVariance with correct number', () => {
                // Assert
                expect(spyGetLatestMeanVariance).toHaveBeenCalledWith(
                    expect.objectContaining({
                        id: workStyleDistribution.id,
                    }),
                    expect.closeTo(0.6010443),
                );
            });

            it('should update job distribution score', async () => {
                // Assert
                const updatedDistributionScore =
                    await jobDistributionScoreRepo.findOneOrFail({
                        select: ['size', 'mean', 'variance', 'alpha', 'beta'],
                        where: {
                            job_id: workStyleDistribution.job_id,
                            score_type: workStyleDistribution.score_type,
                        },
                    });
                expect(updatedDistributionScore.size).toEqual(
                    workStyleDistribution.size + 1,
                );
                expect(updatedDistributionScore.mean).not.toEqual(
                    workStyleDistribution.mean,
                );
                expect(updatedDistributionScore).toMatchSnapshot();
            });
        });

        describe('when score type is reasoning logical', () => {
            beforeAll(async () => {
                // Arrange
                jest.clearAllMocks();

                // Act
                await JobDistributionScoreService.updateJobDistributionScore(
                    reasoningLogicalDistribution.job_id,
                    reasoningLogicalScore as ScoreData,
                );
            });

            it('should call getLatestMeanVariance with correct number', () => {
                // Assert
                expect(spyGetLatestMeanVariance).toHaveBeenCalledWith(
                    expect.objectContaining({
                        id: reasoningLogicalDistribution.id,
                    }),
                    expect.closeTo(0.77832782),
                );
            });

            it('should update job distribution score', async () => {
                // Assert
                const updatedDistributionScore =
                    await jobDistributionScoreRepo.findOneOrFail({
                        select: ['size', 'mean', 'variance', 'alpha', 'beta'],
                        where: {
                            job_id: reasoningLogicalDistribution.job_id,
                            score_type: reasoningLogicalDistribution.score_type,
                        },
                    });
                expect(updatedDistributionScore.size).toEqual(
                    reasoningLogicalDistribution.size + 1,
                );
                expect(updatedDistributionScore.mean).not.toEqual(
                    reasoningLogicalDistribution.mean,
                );
                expect(updatedDistributionScore).toMatchSnapshot();
            });
        });

        describe('when score type is work experience', () => {
            beforeAll(async () => {
                // Arrange
                jest.clearAllMocks();

                // Act
                await JobDistributionScoreService.updateJobDistributionScore(
                    reasoningLogicalDistribution.job_id,
                    workExperienceScore as ScoreData,
                );
            });

            it('should not call getLatestMeanVariance', () => {
                // Assert
                expect(spyGetLatestMeanVariance).not.toHaveBeenCalled();
            });
        });
    });

    describe('getLatestMeanVariance', () => {
        it('should return correct output', () => {
            // Act
            const result = JobDistributionScoreService.getLatestMeanVariance(
                workStyleDistribution,
                0.78,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should still calculate if score is higher than 1', () => {
            // Act
            const result = JobDistributionScoreService.getLatestMeanVariance(
                workStyleDistribution,
                1.1,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should still calculate if score is lower than 0', () => {
            // Act
            const result = JobDistributionScoreService.getLatestMeanVariance(
                workStyleDistribution,
                -0.1,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});
