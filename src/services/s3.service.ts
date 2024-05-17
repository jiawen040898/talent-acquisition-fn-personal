import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AWSConfig } from '@pulsifi/configs';
import { S3ErrorCode, S3ErrorMessage, S3ErrorType } from '@pulsifi/constants';
import { ErrorDetails } from '@pulsifi/fn';
import { streamToString } from '@pulsifi/shared';

export class S3Service {
    private readonly s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: AWSConfig().region,
            apiVersion: AWSConfig().s3.apiVersion,
        });
    }

    async getJsonFileFromS3<T>(bucketName: string, key: string): Promise<T> {
        const params = { Bucket: bucketName, Key: key };
        const command = new GetObjectCommand(params);
        let fileResult: string;

        try {
            const response = await this.s3Client.send(command);
            fileResult = await streamToString(response.Body);
        } catch (error) {
            throw new FailedToGetS3Object({
                error_codes: [S3ErrorCode.FAILED_TO_GET_OBJECT],
                error,
            });
        }

        return JSON.parse(fileResult);
    }
}

export class FailedToGetS3Object extends Error {
    errorDetails: ErrorDetails;

    constructor(errorDetails: ErrorDetails) {
        super(S3ErrorMessage.FAILED_TO_GET_OBJECT);
        this.name = S3ErrorType.FAILED_TO_GET_OBJECT;
        this.errorDetails = errorDetails;
    }
}
