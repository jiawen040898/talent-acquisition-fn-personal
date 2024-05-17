import {
    JobApplicationScoreType,
    JobApplicationSkillSource,
} from '@pulsifi/constants';
import {
    JobApplicationSkill,
    PairwiseScoreOutcomePayload,
} from '@pulsifi/interfaces';
import { Job, JobApplication, JobApplicationCareer } from '@pulsifi/models';
import { DSLookupService, PairwiseScoreService } from '@pulsifi/services';
import {
    testJobApplicationBuilder,
    testJobApplicationCareerBuilder,
    testJobBuilder,
} from '@pulsifi/tests/builders';
import { testJobApplicationSkillBuilder } from '@pulsifi/tests/builders/test-job-application-score-builder';
import { mockRoleFitRecipeWithCompetencyInclusiveness } from '@pulsifi/tests/fixtures';
import { getTestDataSource } from '@pulsifi/tests/setup';
import { DataSource } from 'typeorm';

import { getDataSource, setDataSource } from '../../src/database';

jest.mock('../../src/services/ds-lookup.service');

const mockGetPairwiseSimilarity = jest.fn();
DSLookupService.getPairwiseSimilarity = mockGetPairwiseSimilarity;
mockGetPairwiseSimilarity.mockResolvedValue({
    score: 0.8,
    pairwise_score: {
        Javascript: {
            Python: 0.7,
            Typescript: 0.9,
        },
    },
});

describe('PairwiseScoreService', () => {
    let dataSource: DataSource;
    let jobApplicationId: string;
    beforeAll(async () => {
        setDataSource(await getTestDataSource());

        dataSource = await getDataSource();

        jobApplicationId = '00000000-0000-0000-0001-000000000001';
        const job = testJobBuilder.build();
        const jobApplication = testJobApplicationBuilder.build({
            id: jobApplicationId,
            job_id: job.id,
        });
        const jobApplicationCareer = testJobApplicationCareerBuilder.build({
            job_application_id: jobApplication.id,
        });

        await dataSource.getRepository(Job).save(job);
        await dataSource.getRepository(JobApplication).save(jobApplication);
        await dataSource
            .getRepository(JobApplicationCareer)
            .save(jobApplicationCareer);
    });

    describe('getHardSkillJobApplicationScore', () => {
        it('should return the correct hard skill job application score', async () => {
            // Arrange
            const recipe = mockRoleFitRecipeWithCompetencyInclusiveness;
            const skills = [
                testJobApplicationSkillBuilder.build({
                    name: 'Javascript',
                    source: JobApplicationSkillSource.DAXTRA,
                }),
                testJobApplicationSkillBuilder.build({
                    name: 'Python',
                    source: JobApplicationSkillSource.DAXTRA,
                }),
                testJobApplicationSkillBuilder.build({
                    name: 'Typescript',
                    source: JobApplicationSkillSource.DAXTRA,
                }),
            ];

            // Act
            const result =
                await PairwiseScoreService.getHardSkillJobApplicationScore(
                    skills,
                    recipe,
                    recipe.id,
                    jobApplicationId,
                    5,
                );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should handle the case where the job application has no skills', async () => {
            // Arrange
            const recipe = mockRoleFitRecipeWithCompetencyInclusiveness;
            const skills: JobApplicationSkill[] = [];

            // Act
            const result =
                await PairwiseScoreService.getHardSkillJobApplicationScore(
                    skills,
                    recipe,
                    recipe.id,
                    jobApplicationId,
                    5,
                );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should handle the case where recipe have no skills', async () => {
            // Arrange
            const recipe = Object.assign(
                {},
                mockRoleFitRecipeWithCompetencyInclusiveness,
            );
            recipe.job_competency = [];

            const skills = [
                testJobApplicationSkillBuilder.build({
                    name: 'Javascript',
                    source: JobApplicationSkillSource.DAXTRA,
                }),
                testJobApplicationSkillBuilder.build({
                    name: 'Python',
                    source: JobApplicationSkillSource.DAXTRA,
                }),
                testJobApplicationSkillBuilder.build({
                    name: 'Typescript',
                    source: JobApplicationSkillSource.DAXTRA,
                }),
            ];

            // Act
            const result =
                await PairwiseScoreService.getHardSkillJobApplicationScore(
                    skills,
                    recipe,
                    recipe.id,
                    jobApplicationId,
                    5,
                );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getWorkExpJobApplicationScore', () => {
        it('should return the correct work experience job application score', async () => {
            // Act
            const result =
                await PairwiseScoreService.getWorkExpJobApplicationScore(
                    jobApplicationId,
                    mockRoleFitRecipeWithCompetencyInclusiveness,
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                    5,
                );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should trim job if the job key provided have space', async () => {
            // Arrange
            mockGetPairwiseSimilarity.mockResolvedValueOnce({
                score: 0.8,
                pairwise_score: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Software Engineering': {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        'Software Architect ': 0.7, // having space at the end of the key string
                        Developer: 0.9,
                    },
                },
            });

            // Act
            const result =
                await PairwiseScoreService.getWorkExpJobApplicationScore(
                    jobApplicationId,
                    mockRoleFitRecipeWithCompetencyInclusiveness,
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                    5,
                );

            // Assert
            const matches = (
                result.score_outcome as PairwiseScoreOutcomePayload
            )?.pairwise_result[0]?.matches;
            expect(matches).toEqual(
                expect.arrayContaining([
                    {
                        job_title: 'Software Architect', // should not have space at the end
                        score: 0.7,
                    },
                    { job_title: 'Developer', score: 0.9 },
                ]),
            );
            expect(result).toMatchSnapshot();
        });

        it('should handle the case where the job application has no career', async () => {
            // Act
            const result =
                await PairwiseScoreService.getWorkExpJobApplicationScore(
                    '00000000-0000-0000-0001-000000000002',
                    mockRoleFitRecipeWithCompetencyInclusiveness,
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                    5,
                );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('processPairwiseSkillOutput', () => {
        it('should return the correct pairwise skill output format with hard skill', async () => {
            // Act
            const result =
                await PairwiseScoreService.processPairwiseSkillOutput(
                    mockRoleFitRecipeWithCompetencyInclusiveness.job_competency,
                    ['Javascript', 'Python', 'Typescript '],
                    JobApplicationScoreType.HARD_SKILL,
                );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should return the correct pairwise skill output format with work experience', async () => {
            // Act
            const result =
                await PairwiseScoreService.processPairwiseSkillOutput(
                    mockRoleFitRecipeWithCompetencyInclusiveness.job_competency,
                    ['Javascript', 'Python', 'Typescript'],
                    JobApplicationScoreType.WORK_EXP,
                );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should handle the case where the job application has no career', async () => {
            // Act
            const result =
                await PairwiseScoreService.processPairwiseSkillOutput(
                    mockRoleFitRecipeWithCompetencyInclusiveness.job_competency,
                    [],
                    JobApplicationScoreType.WORK_EXP,
                );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should handle the case where the recipe have no skills', async () => {
            // Act
            const result =
                await PairwiseScoreService.processPairwiseSkillOutput(
                    [],
                    ['Javascript', 'Python', 'Typescript'],
                    JobApplicationScoreType.HARD_SKILL,
                );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});
