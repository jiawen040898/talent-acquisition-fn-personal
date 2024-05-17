import { BetaDistributionService } from '@pulsifi/services';

describe('BetaDistributionService', () => {
    describe('getGammaForUniformSmoothing', () => {
        it('should get gamma for uniform smoothing', () => {
            // Arrange
            const size = 10;

            // Act
            const result =
                BetaDistributionService.getGammaForUniformSmoothing(size);

            // Assert
            expect(result).toBe(0.1);
        });
    });

    describe('getNewMean', () => {
        it('should get new mean with uniform smoothing', () => {
            // Arrange
            const oldMean = 0.5;
            const value = 0.6;

            // Act
            const result = BetaDistributionService.getNewMean(
                oldMean,
                value,
                BetaDistributionService.getGammaForUniformSmoothing(6),
            );

            // Assert
            expect(result).toBe(0.5166666666666666);
        });

        it('should get new mean with exponential smoothing (0.025)', () => {
            // Arrange
            const oldMean = 0.5;
            const value = 0.6;

            // Act
            const result = BetaDistributionService.getNewMean(oldMean, value);

            // Assert
            expect(result).toBe(0.5025);
        });
    });

    describe('getNewVariance', () => {
        it('should get new variance with uniform smoothing', () => {
            // Arrange
            const oldVariance = 0.5;
            const oldMean = 0.5;
            const newMean = 0.5166666666666666;
            const value = 0.6;

            // Act
            const result = BetaDistributionService.getNewVariance(
                oldVariance,
                oldMean,
                newMean,
                value,
                BetaDistributionService.getGammaForUniformSmoothing(6),
            );

            // Assert
            expect(result).toBe(0.41805555555555557);
        });

        it('should get new variance with exponential smoothing (0.025)', () => {
            // Arrange
            const oldVariance = 0.1;
            const oldMean = 0.5;
            const newMean = 0.5166666666666666;
            const value = 0.6;

            // Act
            const result = BetaDistributionService.getNewVariance(
                oldVariance,
                oldMean,
                newMean,
                value,
            );

            // Assert
            expect(result).toBe(0.09770833333333334);
        });
    });

    describe('getAlphaAndBeta', () => {
        it('should get alpha and beta', () => {
            // Arrange
            const mean = 0.5;
            const variance = 0.1;
            const size = 1;

            // Act
            const result = BetaDistributionService.getAlphaAndBeta(
                mean,
                variance,
                size,
            );

            // Assert
            expect(result).toEqual({ alpha: 1, beta: 1 });
        });

        it('should get alpha and beta with size > 1', () => {
            // Arrange
            const mean = 0.5;
            const variance = 0.1;
            const size = 10;

            // Act
            const result = BetaDistributionService.getAlphaAndBeta(
                mean,
                variance,
                size,
            );

            // Assert
            expect(result).toEqual({ alpha: 0.75, beta: 0.75 });
        });
    });
});
