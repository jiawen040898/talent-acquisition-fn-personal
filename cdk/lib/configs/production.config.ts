import type { Construct } from 'constructs';

import type { CDKEnvironmentVariables } from '../interfaces';
import { commonEnvironmentVariables } from './common.config';

export const config = (scope: Construct): CDKEnvironmentVariables => ({
    ...commonEnvironmentVariables(scope),
    SKILL_EXTRACT_API_URL:
        'https://pulsifi-production--skill-extraction-app.modal.run/text',
    SKILL_EXTRACT_API_KEY: '38e86ef2-a358-42ad-915c-a9b7bb16e944',
});
