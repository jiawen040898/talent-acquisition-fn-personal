import { AwsFunctionHandler } from 'serverless/aws';

import { CustomSqs, layers, tags, version } from './variables';

export const processJobDistributionScore: AwsFunctionHandler = {
    name: 'talent-acquisition-score-distribution-fn',
    description: `Receive scores and calculate respective distribution then store into db (v${version})`,
    handler: 'src/functions/process-job-distribution-score.handler',
    // reservedConcurrency: 20,
    events: [
        {
            sqs: {
                arn: 'arn:aws:sqs:${aws:region}:${aws:accountId}:talent-acquisition-score-distribution-queue.fifo',
                batchSize: 1,
                maximumConcurrency: 20,
            } as CustomSqs,
        },
    ],
    layers,
    tags,
};
