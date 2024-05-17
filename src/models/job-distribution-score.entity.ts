import { JobApplicationScoreType } from '@pulsifi/constants';
import {
    DateColumn,
    DecimalColumn,
    IntegerColumn,
    UuidColumn,
} from '@pulsifi/fn/decorators/typeorm';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';

@Entity({ name: 'job_distribution_score' })
export class JobDistributionScore extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @UuidColumn()
    job_id!: string;

    @IntegerColumn()
    company_id!: number;

    @Column({
        enum: JobApplicationScoreType,
    })
    score_type!: JobApplicationScoreType;

    @IntegerColumn()
    size!: number;

    @DecimalColumn({
        precision: 8,
    })
    mean!: number;

    @DecimalColumn({
        precision: 8,
    })
    variance!: number;

    @DecimalColumn()
    alpha!: number;

    @DecimalColumn()
    beta!: number;

    @DateColumn()
    version!: Date;
}
