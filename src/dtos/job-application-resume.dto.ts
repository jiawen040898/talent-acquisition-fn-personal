import { JobApplicationResume } from '@pulsifi/models';

export class JobApplicationResumeDto {
    id?: number;
    job_application_id?: string;
    file_name: string;
    file_path: string;
    original_file_path: string;
    is_primary: boolean;
    content_path?: string;

    constructor(input: JobApplicationResume) {
        this.id = input.id;
        this.job_application_id = input.job_application_id;
        this.file_name = input.file_name;
        this.file_path = input.file_path;
        this.original_file_path = input.original_file_path;
        this.is_primary = input.is_primary;
        this.content_path = input.content_path;
    }
}
