import { JobApplicationActionHistory } from '@pulsifi/models';

export class JobApplicationActionHistoryDto {
    id?: number;
    job_application_id: string;
    action_type: string;
    value?: JSON;
    created_username: string;

    constructor(input: JobApplicationActionHistory) {
        this.id = input.id;
        this.job_application_id = input.job_application_id;
        this.action_type = input.action_type;
        this.value = input.value;
        this.created_username = input.created_username;
    }
}
