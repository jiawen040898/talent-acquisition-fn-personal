import type { Construct } from 'constructs';

import type { CDKEnvironmentVariables } from '../interfaces';
import { commonEnvironmentVariables } from './common.config';

export const config = (scope: Construct): CDKEnvironmentVariables => ({
    ...commonEnvironmentVariables(scope),
    SKILL_EXTRACT_API_URL:
        'https://pulsifi-dev--skill-extraction-app.modal.run/text',
    SKILL_EXTRACT_API_KEY: 'be047073-04c2-43b9-9820-4fab1b118333',
});
