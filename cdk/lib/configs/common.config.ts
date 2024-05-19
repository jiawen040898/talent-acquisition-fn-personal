import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import type { Construct } from 'constructs';

import { accountId, environment, region } from '../../variables';
import type { CommonCDKEnvironmentVariables } from '../interfaces';

export const commonEnvironmentVariables = (
    scope: Construct,
): CommonCDKEnvironmentVariables => ({
    NODE_ENV: environment,
    SENTRY_DSN:
        'https://d6994d3b0e374c8a83ef95055069d63b@o157451.ingest.sentry.io/6531328',
    SERVERLESS_STAGE: environment,
    SM_NAME: 'talent-acquisition-postgresql-credential',
    REDIS_SM_NAME: 'redis-credentials',
    REGION: region,
    AUTH0_SM_NAME: 'talent-acquisition-api-auth0-machine-secret',
    AWS_ALB_DNS: StringParameter.valueForStringParameter(
        scope,
        '/configs/AWS_ALB_BASE_DNS',
    ),
    AUTH0_ENTERPRISE_DOMAIN: StringParameter.valueForStringParameter(
        scope,
        '/configs/api/AUTH0_ENTERPRISE_DOMAIN',
    ),
    AUTH0_ENTERPRISE_API_AUDIENCE: StringParameter.valueForStringParameter(
        scope,
        '/configs/auth0/AUTH0_ENTERPRISE_API_AUDIENCE',
    ),
    SNS_TOPIC_ARN: `arn:aws:sns:${region}:${accountId}:talent-acquisition-topic.fifo`,
    UNLEASH_RESUME_ANALYZE_TOGGLE_NAME: StringParameter.valueForStringParameter(
        scope,
        '/configs/UNLEASH_RESUME_ANALYZE_TOGGLE_NAME',
    ),
    UNLEASH_API_KEY: StringParameter.valueForStringParameter(
        scope,
        '/configs/UNLEASH_API_KEY',
    ),
    UNLEASH_API_URL: StringParameter.valueForStringParameter(
        scope,
        '/configs/UNLEASH_API_URL',
    ),
    UNLEASH_ENV: StringParameter.valueForStringParameter(
        scope,
        '/configs/UNLEASH_ENV',
    ),
    UNLEASH_PROJECT_ID: StringParameter.valueForStringParameter(
        scope,
        '/configs/UNLEASH_PROJECT_ID',
    ),
});
