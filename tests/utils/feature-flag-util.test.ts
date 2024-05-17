import { FeatureToggleName } from '@pulsifi/constants';
import { FeatureToggleService } from '@pulsifi/services';

import { FeatureFlagUtil } from '../../src/shared/utils/feature-flag.util';

const mockIsUnleashFlagEnabled = jest.spyOn(
    FeatureToggleService,
    'isUnleashFlagEnabled',
);

describe('FeatureFlagUtil', () => {
    describe('isUsingNewFitScoreFlow', () => {
        it('should return true if the feature flag is enabled', async () => {
            // Arrange
            mockIsUnleashFlagEnabled.mockResolvedValue(true);

            // Act
            const isNewFlow = await FeatureFlagUtil.isUsingNewFitScoreFlow(1);

            // Assert
            expect(isNewFlow).toBe(true);
            expect(mockIsUnleashFlagEnabled).toHaveBeenCalledWith(
                FeatureToggleName.FIT_SCORE_REVAMP,
                {
                    environment: 'sandbox',
                    companyId: '1',
                },
            );
        });

        it('should return true if the feature flag is enabled', async () => {
            // Arrange
            mockIsUnleashFlagEnabled.mockResolvedValue(false);

            // Act
            const isNewFlow = await FeatureFlagUtil.isUsingNewFitScoreFlow(5);

            // Assert
            expect(isNewFlow).toBe(false);
            expect(mockIsUnleashFlagEnabled).toHaveBeenCalledWith(
                FeatureToggleName.FIT_SCORE_REVAMP,
                {
                    environment: 'sandbox',
                    companyId: '5',
                },
            );
        });
    });
});
