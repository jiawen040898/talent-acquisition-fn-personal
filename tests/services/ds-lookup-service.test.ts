import { DSLookupAPIErrorMessage } from '@pulsifi/constants';
import {
    DSLookupService,
    FailedToGetPairwiseSimilarityFromDSLookupApi,
} from '@pulsifi/services';
import axios from 'axios';

import { testData } from './fixtures/test-data';

describe('DSLookupService', () => {
    const mockHttpServicePost = jest.spyOn(axios, 'post');

    describe('getPairwiseSimilarity', () => {
        beforeEach(() => {
            mockHttpServicePost.mockClear();
        });

        it('should get pairwise similarity for hard skill', async () => {
            // Arrange
            mockHttpServicePost.mockResolvedValue(
                testData.mockGetPairwiseSimilarityHardSkill,
            );
            const payload = {
                job_required_skills: ['communication', 'business management'],
                job_application_skills: ['communication'],
            };

            // Act
            const actual = await DSLookupService.getPairwiseSimilarity(
                payload.job_required_skills,
                payload.job_application_skills,
            );

            // Assert
            expect(actual).toMatchSnapshot();
        });

        it('should get pairwise similarity for work experience', async () => {
            // Arrange
            mockHttpServicePost.mockResolvedValue(
                testData.mockGetPairwiseSimilarityWorkExperience,
            );
            const payload = {
                job_title: ['software engineer', 'sales manager '],
                job_application_roles: ['software engineer'],
            };

            // Act
            const actual = await DSLookupService.getPairwiseSimilarity(
                payload.job_title,
                payload.job_application_roles,
            );

            // Assert
            expect(actual).toMatchSnapshot();
        });

        it('should throw error when get pairwise similarity failed', async () => {
            // Arrange
            mockHttpServicePost.mockRejectedValue(new Error());
            const payload = {
                job_title: ['software engineer', 'sales manager'],
                job_application_roles: ['software engineer'],
            };

            // Act
            const action = () =>
                DSLookupService.getPairwiseSimilarity(
                    payload.job_title,
                    payload.job_application_roles,
                );

            // Assert
            await expect(action).rejects.toThrow(
                DSLookupAPIErrorMessage.FAILED_TO_GET_PAIRWISE_SIMILARITY,
            );

            await expect(action).rejects.toBeInstanceOf(
                FailedToGetPairwiseSimilarityFromDSLookupApi,
            );
        });
    });
});
