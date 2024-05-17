import { DomainFramework, DomainOutcome } from '@pulsifi/fn';
import { PersonalityScoreService } from '@pulsifi/services';
import {
    personalityQuestionnaire,
    workInterestQuestionnaire,
    workValueQuestionnaire,
} from '@pulsifi/tests/fixtures/job-application-questionnaire/test-data';
import { mockRoleFitRecipe } from '@pulsifi/tests/fixtures/recipe/test-data';

const jobApplicationId = '00000000-0000-0000-0000-000000000001';

describe('PersonalityScoreService', () => {
    describe('getPersonalityScores', () => {
        it('should output partial JobApplicationScore', () => {
            // Act
            const result = PersonalityScoreService.getPersonalityScores(
                [
                    personalityQuestionnaire,
                    workInterestQuestionnaire,
                    workValueQuestionnaire,
                ],
                jobApplicationId,
                5,
                mockRoleFitRecipe.id,
                mockRoleFitRecipe,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should work correctly without recipe', () => {
            // Act
            const result = PersonalityScoreService.getPersonalityScores(
                [
                    personalityQuestionnaire,
                    workInterestQuestionnaire,
                    workValueQuestionnaire,
                ],
                jobApplicationId,
                5,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getWorkStyleScoreOutcome', () => {
        it('should return correct output', () => {
            // Act
            const result = PersonalityScoreService.getWorkStyleScoreOutcome(
                personalityQuestionnaire,
                jobApplicationId,
                5,
                mockRoleFitRecipe.id,
                mockRoleFitRecipe,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should return correct output without recipe', () => {
            // Act
            const result = PersonalityScoreService.getWorkStyleScoreOutcome(
                personalityQuestionnaire,
                jobApplicationId,
                5,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getWorkValueScoreOutcome', () => {
        it('should return correct output', () => {
            // Act
            const result = PersonalityScoreService.getWorkValueScoreOutcome(
                workValueQuestionnaire,
                jobApplicationId,
                5,
                mockRoleFitRecipe.id,
                mockRoleFitRecipe,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should return correct output without recipe', () => {
            // Act
            const result = PersonalityScoreService.getWorkValueScoreOutcome(
                workValueQuestionnaire,
                jobApplicationId,
                5,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getWorkInterestScoreOutcome', () => {
        it('should return correct output', () => {
            // Act
            const result = PersonalityScoreService.getWorkInterestScoreOutcome(
                workInterestQuestionnaire,
                jobApplicationId,
                5,
                mockRoleFitRecipe.id,
                mockRoleFitRecipe,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should return correct output without recipe', () => {
            // Act
            const result = PersonalityScoreService.getWorkInterestScoreOutcome(
                workInterestQuestionnaire,
                jobApplicationId,
                5,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('transformDomainOutcome', () => {
        it('should return correct output', () => {
            // Arrange
            const domain: DomainOutcome = {
                domain_score: 0,
                domain_framework: DomainFramework.WORK_STYLE,
                domain_alias: 'verbal',
            };

            // Act
            const result =
                PersonalityScoreService.transformDomainOutcome(domain);

            // Assert
            expect(result).toEqual({
                domain_score: 0,
                domain_framework: DomainFramework.WORK_STYLE,
                domain_alias: 'verbal',
                domain_weightage: null,
                traits: [],
            });
        });

        it('should not replace weightage', () => {
            // Arrange
            const domain: DomainOutcome = {
                domain_score: 0,
                domain_framework: DomainFramework.WORK_STYLE,
                domain_alias: 'verbal',
                domain_weightage: 0.4,
            };

            // Act
            const result =
                PersonalityScoreService.transformDomainOutcome(domain);

            // Assert
            expect(result).toEqual({
                domain_score: 0,
                domain_framework: DomainFramework.WORK_STYLE,
                domain_alias: 'verbal',
                domain_weightage: 0.4,
                traits: [],
            });
        });
    });
});
