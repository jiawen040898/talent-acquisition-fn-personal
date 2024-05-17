import { JobApplicationCareer } from '@pulsifi/models';

import { PlaceDto } from './place.dto';

export class JobApplicationCareerDto {
    id?: number;
    job_application_id: string;
    organization: string;
    role: string;
    is_current: boolean;
    start_date?: Date;
    end_date?: Date;
    description?: string;
    responsibilities_achievements?: string | null;
    place_formatted_address?: string | null;
    place_result?: PlaceDto | null;

    constructor(input: JobApplicationCareer) {
        this.id = input.id;
        this.job_application_id = input.job_application_id;
        this.organization = input.organization;
        this.role = input.role;
        this.is_current = input.is_current;
        this.start_date = input.start_date;
        this.end_date = input.end_date;
        this.description = input.description;
        this.responsibilities_achievements =
            input.responsibilities_achievements;
        this.place_formatted_address = input.place_formatted_address;
        this.place_result = input.place_result
            ? new PlaceDto(input.place_result)
            : null;
    }
}
