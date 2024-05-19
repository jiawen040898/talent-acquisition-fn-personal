import { AwsFunctionHandler } from 'serverless/aws';

import { CustomSqs, layers, tags, version } from './variables';

export const processFitScore: AwsFunctionHandler = {
    name: 'talent-acquisition-fit-score-fn',
    description: `Receive scores and calculate respective distribution then store into db (v${version})`,
    handler: 'src/functions/process-fit-score-calculation.handler',
    // reservedConcurrency: 20,
    events: [
        {
            sqs: {
                arn: 'arn:aws:sqs:${aws:region}:${aws:accountId}:talent-acquisition-fit-score-queue.fifo',
                batchSize: 1,
                maximumConcurrency: 20,
            } as CustomSqs,
        },
    ],
    layers,
    tags,
};
