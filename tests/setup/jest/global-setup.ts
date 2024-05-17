const global = () => {
    process.env.TZ = 'UTC';
    process.env.REGION = 'ap-southeast-1';
    process.env.SENTRY_DSN = 'https://test.pulsifi.me/sentry';
    process.env.SERVERLESS_STAGE = 'test';
    process.env.AWS_SESSION_TOKEN = 'the-token';
    process.env.AWS_ALB_DNS = 'https://alb.test.pulsifi.me';
    process.env.SNS_TOPIC_ARN = 'arn:aws:sns:xxx';
    process.env.UNLEASH_API_KEY =
        'default:development.58a58ec16b64df5c7a2a62fc7e063fb548d2476a6cb452cff85f5d03';
    process.env.UNLEASH_API_URL =
        'https://us.app.unleash-hosted.com/usab1009/api/';
    process.env.UNLEASH_ENV = 'sandbox';
    process.env.UNLEASH_PROJECT_ID = 'default';
    process.env.SKILL_EXTRACT_API_URL =
        'https://pulsifi-dev--resume-parser-main.modal.run';
    process.env.SKILL_EXTRACT_API_KEY = 'be047073-04c2-43b9-9820-4fab1b118333';
    process.env.AUTH0_ENTERPRISE_DOMAIN = 'auth0:xxx';
    process.env.AUTH0_ENTERPRISE_API_AUDIENCE = 'auth0:xxx';
    process.env.AUTH0_SM_NAME = 'auth-sm-name';
};

export default global;
