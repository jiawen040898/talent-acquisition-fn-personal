import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import { ContactType } from '@pulsifi/constants';
import { JobApplicationContactDto } from '@pulsifi/dtos';
import { generatorUtil } from '@pulsifi/fn';
import { S3FileToContactParser } from '@pulsifi/shared';
import { mockClient } from 'aws-sdk-client-mock';
import { Readable } from 'stream';

import sampleResume from '../samples/sample-resume.json';

describe('S3FileToContactParser', () => {
    const s3ClientMock = mockClient(S3Client);
    const stream = new Readable();
    stream.push(JSON.stringify(sampleResume));
    stream.push(null); // end of stream

    // alternatively: create Stream from file
    // const stream = createReadStream();

    // wrap the Stream with SDK mixin
    const sdkStream = sdkStreamMixin(stream);

    s3ClientMock.on(GetObjectCommand).resolves({ Body: sdkStream });

    afterAll(async () => {
        s3ClientMock.reset();
    });

    it('should pass for S3FileToContactParser with valid s3 bucket and key', async () => {
        const jobApplicationId = generatorUtil.uuid();
        const bucketName = 'pulsifi-sandbox-document';
        const key =
            'candidates/resumes/8af8819f-d734-4451-93f2-63d541b053be/sample-resume.json';
        const output: JobApplicationContactDto[] =
            await S3FileToContactParser.parseFile(
                0,
                jobApplicationId,
                bucketName,
                key,
            );

        expect(output).toEqual(
            expect.arrayContaining([
                {
                    job_application_id: jobApplicationId,
                    contact_type: ContactType.EMAIL,
                    value: 'mary.c@emailaddress.co.uk',
                    is_primary: false,
                    created_by: 0,
                    updated_by: 0,
                },
                {
                    job_application_id: jobApplicationId,
                    contact_type: ContactType.MOBILE,
                    value: '4424768885544',
                    is_primary: false,
                    created_by: 0,
                    updated_by: 0,
                },
                {
                    job_application_id: jobApplicationId,
                    contact_type: ContactType.MOBILE,
                    value: '448872229999',
                    is_primary: false,
                    created_by: 0,
                    updated_by: 0,
                },
            ]),
        );
    });
});
