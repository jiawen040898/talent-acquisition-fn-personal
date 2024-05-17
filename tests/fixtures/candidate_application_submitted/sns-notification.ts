import { candidateApplicationSubmittedEvent } from './event-model';

export const snsNotification = {
    Type: 'Notification',
    MessageId: 'b1ed925b-0e9f-53ef-bde2-cae9b12e725e',
    SequenceNumber: '10000000000000000240',
    TopicArn: 'arn:aws:sns:ap-southeast-1:434343955077:candidate-topic.fifo',
    Message: JSON.stringify(candidateApplicationSubmittedEvent),
    Timestamp: '2021-02-26T09:20:49.607Z',
    UnsubscribeURL:
        'https://sns.ap-southeast-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:ap-southeast-1:434343955077:candidate-topic.fifo:6a5dcf21-708a-40d5-b45a-b87a58c7fd85',
    MessageAttributes: {
        EventType: {
            Type: 'String',
            Value: 'candidate_application_submitted',
        },
    },
};
