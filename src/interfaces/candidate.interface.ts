import {
    JobApplicationSkillProficiency,
    JobApplicationSkillSource,
} from '../constants';

export interface JobApplicationSkill {
    name: string;
    source: JobApplicationSkillSource;
    proficiency?: JobApplicationSkillProficiency | null;
}
