import { PublishCommandInput } from '@aws-sdk/client-sns';
import { AWSConfig } from '@pulsifi/configs';
import { logger, snsService } from '@pulsifi/fn';

import { IEventModel } from '../interfaces';

export class PublisherService {
    async sendMessage<T>(message: IEventModel<T>): Promise<void> {
        const publishInput = this.buildPublishInput(message);

        try {
            await snsService.send(message, AWSConfig().sns, publishInput);
        } catch (error) {
            logger.error('Fail to publish message', {
                data: publishInput,
                error,
            });
            throw error;
        }
    }

    private buildPublishInput<T>(message: IEventModel<T>): PublishCommandInput {
        message.timestamp = new Date();

        const input: PublishCommandInput = {
            TopicArn: AWSConfig().sns.topic,
            MessageGroupId: message.event_id,
            Message: JSON.stringify(message),
            MessageAttributes: {
                company_id: {
                    DataType: 'Number',
                    StringValue: message.company_id.toString(),
                },
                user_account_id: {
                    DataType: 'Number',
                    StringValue: message.user_account_id.toString(),
                },
                event_type: {
                    DataType: 'String',
                    StringValue: message.event_type,
                },
            },
        };

        return input;
    }
}
