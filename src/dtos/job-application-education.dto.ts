import { JobApplicationEducation } from '@pulsifi/models';

export class JobApplicationEducationDto {
    id?: number;
    job_application_id: string;
    parent_id: number;
    major_first?: string;
    major_second?: string;
    degree_name?: string;
    school_name?: string;
    grade_type?: string;
    grade_value?: string;
    grade_value_max?: number;
    grade_description?: string;
    start_date?: Date;
    end_date?: Date;
    is_highest: boolean;
    description?: string;
    others?: string;
    grade_cgpa?: number;
    achievements?: string | null;

    constructor(input: JobApplicationEducation) {
        this.id = input.id;
        this.job_application_id = input.job_application_id;
        this.parent_id = input.parent_id;
        this.major_first = input.major_first;
        this.major_second = input.major_second;
        this.degree_name = input.degree_name;
        this.school_name = input.school_name;
        this.grade_type = input.grade_type;
        this.grade_value = input.grade_value;
        this.grade_value_max = input.grade_value_max;
        this.grade_description = input.grade_description;
        this.start_date = input.start_date;
        this.end_date = input.end_date;
        this.is_highest = input.is_highest;
        this.description = input.description;
        this.others = input.others;
        this.grade_cgpa = input.grade_cgpa;
        this.achievements = input.achievements;
    }
}
