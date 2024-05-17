import { custom } from './custom';
import { functions } from './functions';
import { plugins } from './plugins';

export const main = {
    service: 'talent-acquisition-fn',
    frameworkVersion: '3',
    useDotenv: true,
    configValidationMode: 'warn',
    package: {
        individually: true,
    },
    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        versionFunctions: true,
        stackName: 'talent-acquisition-fn-${opt:stage}-stack',
        region: '${opt:region}',
        memorySize: 256,
        timeout: 30,
        logRetentionInDays: '${ssm:/configs/LOG_RETENTION_IN_DAYS}',
        iam: {
            role: 'arn:aws:iam::${aws:accountId}:role/talent-acquisition-lambda-role',
        },
        vpc: {
            securityGroupIds: [
                '${ssm:/talent-acquisition-fn/VPC_SECURITY_GROUP_IDS}',
            ],
            subnetIds: '${ssm:/configs/VPC_PRIVATE_SUBNET_IDS}',
        },
        stackTags: {
            Environment: '${opt:stage}',
            Owner: 'dev-team@pulsifi.me',
            Version: '${env:TAG_VERSION}',
        },
        environment: {
            NODE_ENV: '${opt:stage}',
            SENTRY_DSN:
                'https://d90b58c74cd04285bdeb4f8f69bcd4ab@o157451.ingest.sentry.io/5693380',
            SERVERLESS_STAGE: '${opt:stage}',
            SM_NAME: 'talent-acquisition-postgresql-credential',
            REDIS_SM_NAME: 'redis-credentials',
            REGION: '${aws:region}',
            AUTH0_SM_NAME: 'talent-acquisition-api-auth0-machine-secret',
            AWS_ALB_DNS: '${ssm:/configs/AWS_ALB_BASE_DNS}',
            AUTH0_ENTERPRISE_DOMAIN:
                '${ssm:/configs/api/AUTH0_ENTERPRISE_DOMAIN}',
            AUTH0_ENTERPRISE_API_AUDIENCE:
                '${ssm:/configs/auth0/AUTH0_ENTERPRISE_API_AUDIENCE}',
            SNS_TOPIC_ARN:
                'arn:aws:sns:${aws:region}:${aws:accountId}:talent-acquisition-topic.fifo',
            UNLEASH_RESUME_ANALYZE_TOGGLE_NAME:
                '${ssm:/configs/UNLEASH_RESUME_ANALYZE_TOGGLE_NAME}',
            UNLEASH_API_KEY: '${ssm:/configs/UNLEASH_API_KEY}',
            UNLEASH_API_URL: '${ssm:/configs/UNLEASH_API_URL}',
            UNLEASH_ENV: '${ssm:/configs/UNLEASH_ENV}',
            UNLEASH_PROJECT_ID: '${ssm:/configs/UNLEASH_PROJECT_ID}',
        },
        deploymentBucket: {
            blockPublicAccess: true,
            name: 'talent-acquisition-fn-${opt:stage}-${opt:region}-stack-bucket-1',
            maxPreviousDeploymentArtifacts: 5,
            serverSideEncryption: 'AES256',
        },
    },
    resources: {
        extensions: {
            ReceiverLogGroup: {
                DeletionPolicy: 'Retain',
            },
            ProcessResumeAnalyzedLogGroup: {
                DeletionPolicy: 'Retain',
            },
            ProcessFitScoreLogGroup: {
                DeletionPolicy: 'Retain',
            },
            HandleUpdateScoreDistributionLogGroup: {
                DeletionPolicy: 'Retain',
            },
            ProcessAssessmentScoreLogGroup: {
                DeletionPolicy: 'Retain',
            },
        },
    },
    plugins,
    custom,
    functions,
};

export default main;
