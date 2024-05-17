import { JobApplicationAttachment } from '@pulsifi/models';

export class JobApplicationAttachmentDto {
    id?: number;
    job_application_id: string;
    file_name: string;
    file_path: string;

    constructor(input: JobApplicationAttachment) {
        this.id = input.id;
        this.job_application_id = input.job_application_id;
        this.file_name = input.file_name;
        this.file_path = input.file_path;
    }
}
