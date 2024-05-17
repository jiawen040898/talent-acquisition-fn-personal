import { JobApplicationContact } from '@pulsifi/models';

export class JobApplicationContactDto {
    id?: number;
    job_application_id: string;
    contact_type: string;
    value?: string;
    is_primary: boolean;

    constructor(input: JobApplicationContact) {
        this.id = input.id;
        this.job_application_id = input.job_application_id;
        this.contact_type = input.contact_type;
        this.value = input.value;
        this.is_primary = input.is_primary;
    }
}
