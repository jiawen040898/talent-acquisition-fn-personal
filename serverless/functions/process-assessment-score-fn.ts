import { AwsFunctionHandler } from 'serverless/aws';

import { CustomSqs, layers, tags, version } from './variables';

export const processAssessmentScore: AwsFunctionHandler = {
    name: 'talent-acquisition-assessment-score-fn',
    description: `Receive scores and calculate personality then store into db (v${version})`,
    handler: 'src/functions/process-assessment-score.handler',
    // reservedConcurrency: 20,
    events: [
        {
            sqs: {
                arn: 'arn:aws:sqs:${aws:region}:${aws:accountId}:talent-acquisition-assessment-score-queue.fifo',
                batchSize: 1,
                maximumConcurrency: 20,
            } as CustomSqs,
        },
    ],
    layers,
    tags,
};
