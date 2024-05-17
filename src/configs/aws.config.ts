import { envUtil, SnsConfig } from '@pulsifi/fn';

export const AWSConfig = () => ({
    region: envUtil.get('REGION'),
    secretManager: {
        region: envUtil.get('REGION'),
    },
    sns: <SnsConfig>{
        apiVersion: '2010-03-31',
        region: envUtil.get('REGION'),
        topic: envUtil.get('SNS_TOPIC_ARN'),
    },
    s3: {
        apiVersion: '2006-03-01',
    },
    alb: {
        dns: envUtil.get('AWS_ALB_DNS'),
    },
});
