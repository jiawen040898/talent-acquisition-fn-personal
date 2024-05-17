import { EmploymentType } from '@pulsifi/constants';
import { ApplicationForm } from '@pulsifi/models';

import { PlaceDto } from './place.dto';

export class CreateJobDto {
    title!: string;
    role!: string;
    employment_type!: EmploymentType;
    description?: string;
    skills?: string[];
    place_formatted_address?: string;
    place_result?: PlaceDto;
    role_fit_recipe_id?: string;
    application_form?: ApplicationForm;
    company_id?: number;
}
