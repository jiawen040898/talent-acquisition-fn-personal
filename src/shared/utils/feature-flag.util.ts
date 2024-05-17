import { UnleashConfig } from '@pulsifi/configs';
import { FeatureToggleName } from '@pulsifi/constants';
import { FeatureToggleService } from '@pulsifi/services';

/** @deprecated
 * Keep for future reference if anyone want to implement feature flag
 * */
const isUsingNewFitScoreFlow = async (companyId: number): Promise<boolean> => {
    const unleashContext: { [key: string]: string } = {
        environment: UnleashConfig().environment,
        companyId: companyId.toString(),
    };

    return FeatureToggleService.isUnleashFlagEnabled(
        FeatureToggleName.FIT_SCORE_REVAMP,
        unleashContext,
    );
};

export const FeatureFlagUtil = {
    isUsingNewFitScoreFlow,
};
