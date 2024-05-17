import { FitScoreService } from '@pulsifi/services';
import {
    mockCultureFitRecipe,
    mockRoleFitRecipe,
    mockRoleFitRecipeWithCompetencyInclusiveness,
} from '@pulsifi/tests/fixtures';
import {
    allCompletedNonFitScores,
    reasoningLogicalScore,
    reasoningNumericalScore,
    reasoningVerbalScore,
    workInterestScore,
    workStyleScore,
    workValuesScore,
} from '@pulsifi/tests/fixtures/job-application-score/test-data';

const jobApplicationId = '00000000-0000-0000-0000-000000000001';

describe('FitScoreService', () => {
    describe('mapRoleFitDomainScores', () => {
        it('should return correct output', () => {
            // Act
            const result = FitScoreService.mapRoleFitDomainScores(
                allCompletedNonFitScores,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getRoleFitJobApplicationScore', () => {
        it('should return correct output', () => {
            // Act
            const result = FitScoreService.getRoleFitJobApplicationScore(
                allCompletedNonFitScores,
                mockRoleFitRecipe,
                mockRoleFitRecipe.id,
                jobApplicationId,
                5,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should return void if not all required scores are present for role fit score calculation', () => {
            // Act
            const result = FitScoreService.getRoleFitJobApplicationScore(
                [workStyleScore, workValuesScore],
                mockRoleFitRecipe,
                mockRoleFitRecipe.id,
                jobApplicationId,
                5,
            );

            // Assert
            expect(result).toBeUndefined();
        });
    });

    describe('mapCultureFitDomainScore', () => {
        it('should return correct output', () => {
            // Act
            const result = FitScoreService.mapCultureFitDomainScore(
                allCompletedNonFitScores,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getCultureFitJobApplicationScore', () => {
        it('should return correct output', () => {
            // Act
            const result = FitScoreService.getCultureFitJobApplicationScore(
                allCompletedNonFitScores,
                mockCultureFitRecipe,
                mockCultureFitRecipe.id,
                jobApplicationId,
                5,
            );

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('should return void if not all required scores are present for culture fit score calculation', () => {
            // Act
            const result = FitScoreService.getCultureFitJobApplicationScore(
                [workStyleScore, workValuesScore],
                mockCultureFitRecipe,
                mockCultureFitRecipe.id,
                jobApplicationId,
                5,
            );

            // Assert
            expect(result).toBeUndefined();
        });
    });

    describe('hasAllRequiredScoresForCalculation', () => {
        it.each([
            {
                scores: [],
                recipe: mockCultureFitRecipe,
                result: false,
                name: 'empty scores',
                recipeName: 'culture fit recipe',
            },
            {
                scores: [],
                recipe: mockRoleFitRecipe,
                result: false,
                name: 'empty scores',
                recipeName: 'role fit recipe',
            },
            {
                scores: allCompletedNonFitScores,
                recipe: mockCultureFitRecipe,
                result: true,
                name: 'all completed non fit scores',
                recipeName: 'culture fit recipe',
            },
            {
                scores: allCompletedNonFitScores,
                recipe: mockRoleFitRecipe,
                result: true,
                name: 'all completed non fit scores',
                recipeName: 'role fit recipe',
            },
            {
                scores: allCompletedNonFitScores,
                recipe: mockRoleFitRecipeWithCompetencyInclusiveness,
                result: true,
                name: 'all completed non fit scores',
                recipeName: 'role fit recipe with competency inclusiveness',
            },
            {
                scores: [workStyleScore, workValuesScore, workInterestScore],
                recipe: mockCultureFitRecipe,
                result: true,
                name: 'work style, work values, work interest scores',
                recipeName: 'culture fit recipe',
            },
            {
                scores: [workStyleScore, workValuesScore, workInterestScore],
                recipe: mockRoleFitRecipe,
                result: false,
                name: 'work style, work values, work interest scores',
                recipeName: 'role fit recipe',
            },
            {
                scores: [workStyleScore, workValuesScore],
                recipe: mockCultureFitRecipe,
                result: false,
                name: 'work style, work values scores',
                recipeName: 'culture fit recipe',
            },
            {
                scores: [workStyleScore, workValuesScore, workInterestScore],
                recipe: mockRoleFitRecipe,
                result: false,
                name: 'work style, work values, work interest scores',
                recipeName: 'role fit recipe',
            },
            {
                scores: [
                    workStyleScore,
                    workValuesScore,
                    workInterestScore,
                    workInterestScore,
                    reasoningLogicalScore,
                    reasoningVerbalScore,
                    reasoningNumericalScore,
                ],
                recipe: mockRoleFitRecipe,
                result: true,
                name: 'all score except pairwise skill',
                recipeName: 'role fit recipe',
            },
            {
                scores: [
                    workStyleScore,
                    workValuesScore,
                    workInterestScore,
                    reasoningLogicalScore,
                    reasoningVerbalScore,
                    reasoningNumericalScore,
                ],
                recipe: mockRoleFitRecipeWithCompetencyInclusiveness,
                result: false,
                name: 'all score except pairwise skill',
                recipeName: 'role fit recipe with competency inclusiveness',
            },
        ])(
            `should return $result when score given is $name and recipe is $recipeName`,
            ({ scores: jobApplicationScores, recipe, result }) => {
                // Act
                const isCalculated =
                    FitScoreService.hasAllRequiredScoresForCalculation(
                        recipe,
                        jobApplicationScores,
                    );

                // Assert
                expect(isCalculated).toEqual(result);
            },
        );
    });
});
