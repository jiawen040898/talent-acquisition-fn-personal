import { AwsFunctionHandler, Sqs } from 'serverless/aws';

import { layers, tags, version } from './variables';

interface CustomSqs extends Sqs {
    maximumConcurrency: number;
}

export const processResumeAnalyzed: AwsFunctionHandler = {
    name: 'talent-acquisition-resume-analyzed-fn',
    description: `Process Resume Analyzed (v${version})`,
    handler: 'src/functions/process-resume-analyzed.handler',
    reservedConcurrency: 20,
    timeout: 60,
    environment: {
        SKILL_EXTRACT_API_URL:
            '${ssm:/talent-acquisition-fn/SKILL_EXTRACT_API_URL}',
        SKILL_EXTRACT_API_KEY:
            '${ssm:/talent-acquisition-fn/SKILL_EXTRACT_API_KEY}',
    },
    events: [
        {
            sqs: {
                arn: 'arn:aws:sqs:${aws:region}:${aws:accountId}:talent-acquisition-resume-analyzed-queue.fifo',
                batchSize: 1,
                maximumConcurrency: 15,
            } as CustomSqs,
        },
    ],
    layers,
    tags,
};
