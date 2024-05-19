import { AwsFunctionHandler } from 'serverless/aws';

import { CustomSqs, layers, tags, version } from './variables';

export const handleProcessDomainEvent: AwsFunctionHandler = {
    name: 'talent-acquisition-fn',
    description: `Process SQS messages from Talent Acquisition Domain Queue (v${version})`,
    handler: 'src/functions/process-domain-event.handler',
    // reservedConcurrency: 40,
    events: [
        {
            sqs: {
                arn: 'arn:aws:sqs:${aws:region}:${aws:accountId}:talent-acquisition-domain-queue.fifo',
                batchSize: 1,
                maximumConcurrency: 40,
            } as CustomSqs,
        },
    ],
    layers,
    tags,
};
