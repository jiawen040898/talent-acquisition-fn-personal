import { JobApplicationScore } from '@pulsifi/models';
import { Repository } from 'typeorm';

import { BaseQueryBuilder } from './base-query.builder';

export class JobApplicationScoreQueryBuilder extends BaseQueryBuilder<JobApplicationScore> {
    constructor(repository: Repository<JobApplicationScore>) {
        super(repository, 'jobAppScore');
    }

    whereJobApplicationIs(
        jobApplicationId: string,
    ): JobApplicationScoreQueryBuilder {
        this.builder.andWhere(
            `${this.alias}.job_application_id = :jobApplicationId`,
            {
                jobApplicationId,
            },
        );

        return this;
    }

    whereJobApplicationAndScoreTypeIs(
        jobApplicationId: string,
        scoreType: string | undefined,
    ): JobApplicationScoreQueryBuilder {
        this.builder.andWhere(
            `${this.alias}.job_application_id = :jobApplicationId and ${this.alias}.score_type = :scoreType`,
            {
                jobApplicationId,
                scoreType,
            },
        );

        return this;
    }

    whereJobApplicationAndScoreTypeIn(
        jobApplicationId: string,
        scoreType: string[],
    ): JobApplicationScoreQueryBuilder {
        this.builder.andWhere(
            `${this.alias}.job_application_id = :jobApplicationId and score_type IN (:...scoreType)`,
            {
                jobApplicationId,
                scoreType,
            },
        );

        return this;
    }
}
