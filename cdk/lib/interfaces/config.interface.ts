export type CommonCDKEnvironmentVariables = {
    NODE_ENV: string;
    SENTRY_DSN: string;
    SERVERLESS_STAGE: string;
    SM_NAME: string;
    REDIS_SM_NAME: string;
    REGION: string;
    AUTH0_SM_NAME: string;
    AWS_ALB_DNS: string;
    AUTH0_ENTERPRISE_DOMAIN: string;
    AUTH0_ENTERPRISE_API_AUDIENCE: string;
    SNS_TOPIC_ARN: string;
    UNLEASH_RESUME_ANALYZE_TOGGLE_NAME: string;
    UNLEASH_API_KEY: string;
    UNLEASH_API_URL: string;
    UNLEASH_ENV: string;
    UNLEASH_PROJECT_ID: string;
};

export type CDKEnvironmentVariables = {
    SKILL_EXTRACT_API_URL: string;
    SKILL_EXTRACT_API_KEY: string;
} & CommonCDKEnvironmentVariables;
