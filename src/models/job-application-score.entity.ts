import { JobApplicationScoreType } from '@pulsifi/constants';
import { JobApplicationScoreOutcome } from '@pulsifi/interfaces';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';
import { JobApplication } from './job-application.entity';

@Entity({ name: 'job_application_score' })
export class JobApplicationScore extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        type: 'uuid',
    })
    job_application_id!: string;

    @Column({
        type: 'uuid',
        nullable: true,
    })
    score_recipe_id?: string;

    @Column('simple-json', {
        nullable: true,
    })
    score_outcome?: JobApplicationScoreOutcome;

    @Column({
        length: 100,
    })
    score_type!: JobApplicationScoreType;

    @Column({
        type: 'smallint',
    })
    score_dimension!: number;

    @Column({
        type: 'decimal',
        precision: 7,
        nullable: true,
    })
    score?: number | null;

    @Column({
        type: 'decimal',
        precision: 7,
        nullable: true,
    })
    percentile?: number;

    @Column({
        length: 100,
        nullable: true,
    })
    percentile_source?: string;

    @Column({
        length: 10,
        nullable: true,
    })
    percentile_api_version?: string;

    @ManyToOne(() => JobApplication, (jobApplication) => jobApplication.scores)
    @JoinColumn({ name: 'job_application_id' })
    job_application?: JobApplication;
}
