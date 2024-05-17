import { roundDecimalPlace } from '@pulsifi/shared';

describe('NumberUtil', () => {
    describe('roundDecimalPlace', () => {
        it('should round a number to 2 decimal places', () => {
            // Act
            const result = roundDecimalPlace(1.2345678);

            // Assert
            expect(result).toBe(1.23);
        });
    });
});
