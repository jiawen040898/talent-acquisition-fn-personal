import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import { snsService } from '@pulsifi/fn';
import { JobApplication } from '@pulsifi/models';
import {
    FeatureToggleService,
    JobApplicationSkillExtractionService,
    SkillExtractAPIService,
} from '@pulsifi/services';
import { mockClient } from 'aws-sdk-client-mock';
import { Readable } from 'stream';
import { DataSource, Repository } from 'typeorm';

import * as database from '../../src/database';
import sampleFailedResume from '../samples/sample-failed-resume.json';
import sampleResume from '../samples/sample-resume.json';
import { getTestDataSourceAndAddData } from '../setup';
import { testData } from './fixtures/test-data';

jest.mock('@pulsifi/fn/services/sns.service');
const mockFeatureToggleService = jest.fn();
const mockSkillExtractAPIResponse = jest.fn();

describe('JobApplicationSkillExtractionService', () => {
    const jobApplicationSkillExtractionService =
        JobApplicationSkillExtractionService;
    let dataSource: DataSource;
    let jobApplicationRepo: Repository<JobApplication>;
    const featureToggleService = FeatureToggleService;
    const skillExtractAPIService = SkillExtractAPIService;

    beforeAll(async () => {
        dataSource = await getTestDataSourceAndAddData(
            testData.entitiesToBeAdded,
        );

        jest.spyOn(database, 'getDataSource').mockImplementation(() => {
            return Promise.resolve(dataSource);
        });

        jobApplicationRepo = dataSource.getRepository(JobApplication);
        featureToggleService.isUnleashFlagEnabled = mockFeatureToggleService;
        skillExtractAPIService.getOpenAISkills = mockSkillExtractAPIResponse;
    });

    describe('extractJobApplicationSkills', () => {
        const s3ClientMock = mockClient(S3Client);

        afterEach(async () => {
            jest.mocked(snsService.send).mockReset();
            s3ClientMock.reset();
        });

        it('should return void if no resume and role fit', async () => {
            // Act
            const result =
                await jobApplicationSkillExtractionService.extractJobApplicationSkills(
                    1,
                    testData.jobApplicationPayload3,
                );

            // Assert
            expect(result).toBeUndefined();
        });

        describe('if have candidate skills input', () => {
            it('should successfully extract and save by prioritize candidate skills if they match the candidate skills.', async () => {
                // Arrange
                mockFeatureToggleService.mockResolvedValueOnce(true);
                mockSkillExtractAPIResponse.mockResolvedValueOnce(
                    testData.mockSkillExtractAPIResponseWithoutResume,
                );

                // Act
                await jobApplicationSkillExtractionService.extractJobApplicationSkills(
                    1,
                    testData.jobApplicationPayload,
                );

                // Assert
                const jobApplication = await jobApplicationRepo.findOne({
                    where: { id: testData.jobApplication.id },
                });

                expect(jobApplication!.skills).toMatchSnapshot();
            });

            it('should successfully extract and save candidate skills, including those not matching the candidate skills.', async () => {
                // Arrange
                mockFeatureToggleService.mockResolvedValueOnce(true);
                mockSkillExtractAPIResponse.mockResolvedValueOnce({
                    ...testData.mockSkillExtractAPIResponseWithoutResume,
                    competencies: [{ skill: 'NodeJS', category: 'Softwares' }],
                });

                // Act
                await jobApplicationSkillExtractionService.extractJobApplicationSkills(
                    1,
                    testData.jobApplicationPayload,
                );

                // Assert
                const jobApplication = await jobApplicationRepo.findOne({
                    where: { id: testData.jobApplication.id },
                });

                expect(jobApplication!.skills).toMatchSnapshot();
            });
        });

        describe('if no candidate skills input', () => {
            it('should successfully extract and save all unique daxtra & openAI skills', async () => {
                // Arrange
                const s3ClientMock = mockClient(S3Client);
                const stream = new Readable();
                stream.push(JSON.stringify(sampleResume));
                stream.push(null);
                const sdkStream = sdkStreamMixin(stream);
                s3ClientMock.on(GetObjectCommand).resolves({ Body: sdkStream });

                mockFeatureToggleService.mockResolvedValueOnce(true);
                mockSkillExtractAPIResponse.mockResolvedValueOnce(
                    testData.mockSkillExtractAPIResponse,
                );

                // Act
                await jobApplicationSkillExtractionService.extractJobApplicationSkills(
                    1,
                    testData.jobApplicationPayload2,
                );

                // Assert
                const jobApplication = await jobApplicationRepo.findOne({
                    where: { id: testData.jobApplication2.id },
                });

                expect(jobApplication!.skills).toMatchSnapshot();
            });

            it('should return empty extraction result , if daxtra text resume has no content', async () => {
                // Arrange
                const stream = new Readable();
                stream.push(JSON.stringify(sampleFailedResume));
                stream.push(null);
                const sdkStream = sdkStreamMixin(stream);
                s3ClientMock.on(GetObjectCommand).resolves({ Body: sdkStream });

                mockFeatureToggleService.mockResolvedValueOnce(true);
                mockSkillExtractAPIResponse.mockResolvedValueOnce(
                    testData.mockSkillExtractAPIEmptyResponse,
                );

                // Act
                await jobApplicationSkillExtractionService.extractJobApplicationSkills(
                    1,
                    testData.jobApplicationPayload4,
                );

                // Assert
                const jobApplication = await jobApplicationRepo.findOne({
                    where: { id: testData.jobApplication4.id },
                });

                expect(jobApplication!.skills).toMatchSnapshot();
            });
        });
    });
});
