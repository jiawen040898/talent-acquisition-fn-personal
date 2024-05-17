import { CognitiveScoreService } from '@pulsifi/services';
import {
    testJobApplicationBuilder,
    testJobApplicationScoreBuilder,
    testJobBuilder,
} from '@pulsifi/tests/builders';
import {
    completedQuestionnaires,
    mockRoleFitRecipe,
    reasoningNumericQuestionnaire,
} from '@pulsifi/tests/fixtures';
import {
    logicalPartialScoreOutput,
    numericPartialScoreOutput,
    reasoningNumericalScore,
    verbalPartialScoreOutput,
} from '@pulsifi/tests/fixtures/job-application-score/test-data';
import { getTestDataSource } from '@pulsifi/tests/setup';
import { DataSource } from 'typeorm';

import { getDataSource, setDataSource } from '../../src/database';

describe('CognitiveScoreService', () => {
    let dataSource: DataSource;
    const jobApplicationId = '00000000-0000-0000-0001-000000000001';
    const jobApplicationId2 = '00000000-0000-0000-0001-000000000002';
    const jobApplicationId3 = '00000000-0000-0000-0001-000000000003';

    beforeAll(async () => {
        setDataSource(await getTestDataSource());
        dataSource = await getDataSource();

        const job = testJobBuilder.build({
            id: '00000000-0000-0000-0001-100000000001',
        });
        const jobApplication = testJobApplicationBuilder.build({
            id: jobApplicationId,
            job_id: job.id,
        });
        const jobApplication2 = testJobApplicationBuilder.build({
            id: jobApplicationId2,
            job_id: job.id,
        });
        const jobApplication3 = testJobApplicationBuilder.build({
            id: jobApplicationId3,
            job_id: job.id,
        });
        const jobApplicationScore = testJobApplicationScoreBuilder.build({
            ...reasoningNumericalScore,
            id: undefined,
            job_application_id: jobApplication.id,
        });
        const jobApplicationScore2 = testJobApplicationScoreBuilder.build({
            ...reasoningNumericalScore,
            id: undefined,
            job_application_id: jobApplication3.id,
        });

        await dataSource.getRepository('Job').save(job);
        await dataSource
            .getRepository('JobApplication')
            .save([jobApplication, jobApplication2, jobApplication3]);
        await dataSource
            .getRepository('JobApplicationScore')
            .save([jobApplicationScore, jobApplicationScore2]);
    });

    describe('getCognitiveScores', () => {
        it('should return correct output', async () => {
            // Act
            const result = await CognitiveScoreService.getCognitiveScores(
                completedQuestionnaires,
                jobApplicationId,
                5,
                mockRoleFitRecipe.id,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should still be able to calculate average score when not all cognitive are calculated', async () => {
            // Act
            const result = await CognitiveScoreService.getCognitiveScores(
                [reasoningNumericQuestionnaire],
                '00000000-0000-0000-0000-000000000002',
                5,
                mockRoleFitRecipe.id,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('processReasoningAverage', () => {
        it('should return correct output', async () => {
            // Act
            const result = await CognitiveScoreService.processReasoningAverage(
                [
                    verbalPartialScoreOutput,
                    logicalPartialScoreOutput,
                    numericPartialScoreOutput,
                ],
                jobApplicationId,
                5,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should return correct output with incomplete average', async () => {
            // Act
            const result = await CognitiveScoreService.processReasoningAverage(
                [numericPartialScoreOutput],
                jobApplicationId,
                5,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should return correct output with complete score combining with db', async () => {
            // Act
            const result = await CognitiveScoreService.processReasoningAverage(
                [logicalPartialScoreOutput, verbalPartialScoreOutput],
                jobApplicationId3,
                5,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('processCognitiveScore', () => {
        it('should return correct output', () => {
            // Act
            const result = CognitiveScoreService.processCognitiveScore(
                reasoningNumericQuestionnaire,
                jobApplicationId,
                5,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});
