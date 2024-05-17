import { Job, JobApplication } from '@pulsifi/models';
import { Repository } from 'typeorm';

import { BaseQueryBuilder } from './base-query.builder';

export class JobApplicationQueryBuilder extends BaseQueryBuilder<JobApplication> {
    constructor(repository: Repository<JobApplication>) {
        super(repository, 'jobApp');
    }

    relateJob(): JobApplicationQueryBuilder {
        this.builder.leftJoinAndSelect(`${this.alias}.job`, 'job');

        this.builder.addSelect([...jobFields.map((field) => `job.${field}`)]);

        return this;
    }

    relateQuestionnaires(): JobApplicationQueryBuilder {
        this.builder.leftJoinAndSelect(
            `${this.alias}.questionnaires`,
            'questionnaire',
        );

        return this;
    }

    relateContacts(): JobApplicationQueryBuilder {
        this.builder.leftJoinAndSelect(`${this.alias}.contacts`, 'contacts');

        return this;
    }

    relateResumes(): JobApplicationQueryBuilder {
        this.builder.leftJoinAndSelect(`${this.alias}.resumes`, 'resumes');

        return this;
    }

    relateCareers(): JobApplicationQueryBuilder {
        this.builder.leftJoinAndSelect(`${this.alias}.careers`, 'careers');

        return this;
    }

    whereJobApplicationIs(id: string): JobApplicationQueryBuilder {
        this.builder.andWhere(`${this.alias}.id = :id`, {
            id,
        });

        return this;
    }

    whereCandidateApplicationIs(id: string): JobApplicationQueryBuilder {
        this.builder.andWhere(
            `${this.alias}.ext_candidate_job_application_id = :id`,
            {
                id,
            },
        );

        return this;
    }
}

const jobFields: (keyof Job)[] = [
    'id',
    'title',
    'role',
    'role_fit_recipe_id',
    'culture_fit_recipe_id',
];
