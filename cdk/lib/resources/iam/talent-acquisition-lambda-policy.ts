import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { accountId } from '../../../variables';

const s3Permissions = (scope: Construct) =>
    new PolicyStatement({
        actions: ['s3:GetObject'],
        effect: Effect.ALLOW,
        resources: [
            `arn:aws:s3:::${StringParameter.valueForStringParameter(
                scope,
                '/configs/S3_DOCUMENT_BUCKET',
            )}/*`,
        ],
        sid: 'S3Permissions',
    });

const sqsPermissions = new PolicyStatement({
    actions: [
        'sqs:DeleteMessage',
        'sqs:ReceiveMessage',
        'sqs:GetQueueAttributes',
    ],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:sqs:*:${accountId}:talent-acquisition-domain-queue.fifo`,
        `arn:aws:sqs:*:${accountId}:talent-acquisition-resume-analyzed-queue.fifo`,
        `arn:aws:sqs:*:${accountId}:talent-acquisition-score-distribution-queue.fifo`,
        `arn:aws:sqs:*:${accountId}:talent-acquisition-fit-score-queue.fifo`,
        `arn:aws:sqs:*:${accountId}:talent-acquisition-assessment-score-queue.fifo`,
    ],
    sid: 'SQSPermissions',
});

const secretManagerPermissions = new PolicyStatement({
    actions: ['secretsmanager:DescribeSecret', 'secretsmanager:GetSecretValue'],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:secretsmanager:*:${accountId}:secret:talent-acquisition-postgresql-credential-*`,
        `arn:aws:secretsmanager:*:${accountId}:secret:talent-acquisition-api-auth0-machine-secret-*`,
        `arn:aws:secretsmanager:*:${accountId}:secret:redis-credentials-*`,
        `arn:aws:secretsmanager:*:${accountId}:secret:fit-score-recalculation-credential-*`,
    ],
    sid: 'SecretManagerPermissions',
});

const snsPermissions = new PolicyStatement({
    actions: ['sns:Publish'],
    effect: Effect.ALLOW,
    resources: [`arn:aws:sns:*:${accountId}:talent-acquisition-topic.fifo`],
    sid: 'SNSPermissions',
});

const sqsCustomPermissions = new PolicyStatement({
    actions: ['sqs:SendMessage'],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:sqs:*:${accountId}:notification-email-request-queue`,
        `arn:aws:sqs:*:${accountId}:notification-domain-queue.fifo`,
        `arn:aws:sqs:*:${accountId}:talent-acquisition-resume-analyzed-queue.fifo`,
    ],
    sid: 'SQSCustomPermissions',
});

const parameterStorePermissions = new PolicyStatement({
    actions: [
        'ssm:GetParameter',
        'ssm:GetParameters',
        'ssm:GetParametersByPath',
    ],
    effect: Effect.ALLOW,
    resources: [
        `arn:aws:ssm:*:${accountId}:parameter/talent-acquisition-fn/*`,
        `arn:aws:ssm:*:${accountId}:parameter/configs/*`,
    ],
    sid: 'ParameterStorePermissions',
});

export const talentAcquisitionLambdaPolicy = [
    s3Permissions,
    sqsPermissions,
    secretManagerPermissions,
    snsPermissions,
    sqsCustomPermissions,
    parameterStorePermissions,
];
