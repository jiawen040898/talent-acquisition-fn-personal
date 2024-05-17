import { UnleashConfig } from '@pulsifi/configs';
import { FeatureToggleName } from '@pulsifi/constants';
import { FeatureToggleService } from '@pulsifi/services';

const mockFeatureToggleService = jest.fn();

describe('FeatureToggleService', () => {
    const featureToggleService = FeatureToggleService;
    featureToggleService.isUnleashFlagEnabled = mockFeatureToggleService;

    describe('isUnleashFlagEnabled', () => {
        it('should return true if context is enabled in unleash', async () => {
            // Arrange
            const companyId = 304;
            const unleashContext: { [key: string]: string } = {
                environment: UnleashConfig().environment,
                companyId: companyId.toString(),
            };
            mockFeatureToggleService.mockResolvedValueOnce(true);

            // Act
            const isUnleashFlagEnabled =
                await featureToggleService.isUnleashFlagEnabled(
                    FeatureToggleName.RESUME_ANALYZE,
                    unleashContext,
                );

            // Assert
            expect(isUnleashFlagEnabled).toEqual(true);
        });

        it('should return false if context is not enabled in unleash', async () => {
            // Arrange
            const invalidCompanyId = 999;
            const unleashContext: { [key: string]: string } = {
                environment: UnleashConfig().environment,
                companyId: invalidCompanyId.toString(),
            };
            mockFeatureToggleService.mockResolvedValueOnce(false);

            // Act
            const isUnleashFlagEnabled =
                await featureToggleService.isUnleashFlagEnabled(
                    FeatureToggleName.RESUME_ANALYZE,
                    unleashContext,
                );

            // Assert
            expect(isUnleashFlagEnabled).toEqual(false);
        });
    });
});
