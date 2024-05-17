import { SkillExtractAPIErrorMessage } from '@pulsifi/constants';
import {
    FailedToGetExtractedSkillFromExtractSkillAPI,
    SkillExtractAPIService,
} from '@pulsifi/services';
import axios from 'axios';

import { testData } from './fixtures/test-data';

jest.mock('axios');
const mockSkillExtractAPIService = jest.spyOn(
    SkillExtractAPIService,
    'getOpenAISkills',
);
const mockHttpService = jest.fn();

describe('SkillExtractAPIService', () => {
    const skillExtractAPIService = SkillExtractAPIService;

    describe('skillExtractionFromDaxtraTextSummary', () => {
        it('should passed and return extracted skill', async () => {
            // Arrange
            mockSkillExtractAPIService.mockResolvedValueOnce(
                testData.mockSkillExtractAPIResponse,
            );

            // Act
            const action = await skillExtractAPIService.getOpenAISkills(
                testData.mockDaxtraTextSummary,
            );

            // Assert
            expect(action).toEqual({
                is_resume: true,
                competencies: expect.arrayContaining([
                    {
                        skill: 'Organisational Skills',
                        category: 'WorkExperienceSkill',
                    },
                ]),
            });
        });

        it('should throw error when extract skill failed', async () => {
            // Arrange
            axios.post = mockHttpService;
            mockHttpService.mockRejectedValueOnce(new Error());

            // Act
            const action = () =>
                skillExtractAPIService.getOpenAISkills(
                    testData.mockDaxtraTextSummary,
                );

            // Assert
            await expect(action).rejects.toThrow(
                SkillExtractAPIErrorMessage.FAILED_TO_GET_EXTRACTED_SKILL,
            );
            await expect(action).rejects.toBeInstanceOf(
                FailedToGetExtractedSkillFromExtractSkillAPI,
            );
        });
    });
});
