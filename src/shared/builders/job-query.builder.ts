import { Job, JobQuestionnaire } from '@pulsifi/models';
import { Repository } from 'typeorm';

import { BaseQueryBuilder } from './base-query.builder';

export class JobQueryBuilder extends BaseQueryBuilder<Job> {
    constructor(repository: Repository<Job>) {
        super(repository, 'job');
    }

    relateQuestionnaires(): JobQueryBuilder {
        this.builder.leftJoinAndSelect(
            `${this.alias}.questionnaires`,
            'questionnaire',
        );

        return this;
    }

    selectJobDetails(): JobQueryBuilder {
        this.builder.addSelect([
            ...jobFields.map((field) => `job.${field}`),
            ...jobQuestionnaireFields.map((field) => `questionnaire.${field}`),
        ]);

        return this;
    }

    whereJobIs(jobId: string): JobQueryBuilder {
        this.builder.andWhere(`${this.alias}.id = :jobId`, {
            jobId,
        });

        return this;
    }
}

const jobFields: (keyof Job)[] = [
    'id',
    'role_fit_recipe_id',
    'culture_fit_recipe_id',
];

const jobQuestionnaireFields: (keyof JobQuestionnaire)[] = [
    'id',
    'questionnaire_id',
    'questionnaire_framework',
];
