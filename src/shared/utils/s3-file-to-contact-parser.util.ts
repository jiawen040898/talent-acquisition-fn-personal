import { GetObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { AWSConfig } from '@pulsifi/configs';
import { ContactType } from '@pulsifi/constants';
import { logger } from '@pulsifi/fn';
import { JobApplicationContact } from '@pulsifi/models';
import { PartialDaxtraS3 } from 'src/interfaces/daxtra-response.interface';

import { parseNumber } from './phone-parser';
import { streamToString } from './string.util';

const getJsonFileFromS3 = async (bucketName: string, key: string) => {
    const params = { Bucket: bucketName, Key: key };

    const command = new GetObjectCommand(params);

    const s3Client = new S3Client(<S3ClientConfig>{
        apiVersion: AWSConfig().s3.apiVersion,
        region: AWSConfig().region,
    });

    let fileResult: string;
    try {
        const response = await s3Client.send(command);
        fileResult = await streamToString(response.Body);
    } catch (error) {
        logger.error('Fail to get object', {
            data: command,
            error,
        });
        throw error;
    }

    return JSON.parse(fileResult);
};

export const S3FileToContactParser = {
    parseFile: async (
        createdBy: number,
        jobApplicationId: string,
        bucketName: string,
        key: string,
    ): Promise<JobApplicationContact[]> => {
        const contacts: JobApplicationContact[] = [];

        const parsedS3: PartialDaxtraS3 = await getJsonFileFromS3(
            bucketName,
            key,
        );

        if (parsedS3.StructuredResume.ContactMethod) {
            const inputContacts = parsedS3.StructuredResume.ContactMethod;

            /** handle InternetEmailAddress_main */
            if (inputContacts.InternetEmailAddress_main) {
                const newContact: JobApplicationContact = {
                    job_application_id: jobApplicationId,
                    contact_type: ContactType.EMAIL,
                    value: inputContacts.InternetEmailAddress_main,
                    is_primary: false,
                    created_by: createdBy,
                    updated_by: createdBy,
                };
                if (!contacts.includes(newContact)) {
                    contacts.push(newContact);
                }
            }

            /** handle Telephone_home */
            if (inputContacts.Telephone_home) {
                const value: string = parseNumber(inputContacts.Telephone_home);
                const newContact: JobApplicationContact = {
                    job_application_id: jobApplicationId,
                    contact_type: ContactType.MOBILE,
                    value,
                    is_primary: false,
                    created_by: createdBy,
                    updated_by: createdBy,
                };
                if (!contacts.includes(newContact)) {
                    contacts.push(newContact);
                }
            }

            /** handle Telephone_mobile */
            if (inputContacts.Telephone_mobile) {
                const value: string = parseNumber(
                    inputContacts.Telephone_mobile,
                );
                const newContact: JobApplicationContact = {
                    job_application_id: jobApplicationId,
                    contact_type: ContactType.MOBILE,
                    value,
                    is_primary: false,
                    created_by: createdBy,
                    updated_by: createdBy,
                };
                if (!contacts.includes(newContact)) {
                    contacts.push(newContact);
                }
            }
        }

        return contacts;
    },
};
