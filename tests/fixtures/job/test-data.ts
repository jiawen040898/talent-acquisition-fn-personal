import { EmploymentType } from '@pulsifi/constants';
import { CreateJobDto } from '@pulsifi/dtos';

export const minJobFieldsPayload: CreateJobDto = {
    title: 'job title A',
    role: 'job role A',
    employment_type: EmploymentType.FULLTIME,
    role_fit_recipe_id: 'asdasdda',
};
