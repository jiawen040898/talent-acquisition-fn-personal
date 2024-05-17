import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';
import { Job } from './job.entity';

@Entity({ name: 'job_screening_question' })
export class JobScreeningQuestion extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable: false,
    })
    job_id!: string;

    @Column({
        nullable: false,
        length: 45,
    })
    alias!: string;

    @Column({
        nullable: false,
    })
    order_no!: number;

    @Column('simple-json', {
        nullable: false,
    })
    schema!: JSON;

    @Column('simple-json', {
        nullable: true,
    })
    rule?: JSON;

    @Column({
        nullable: true,
    })
    question_hash_code?: number;

    @ManyToOne(() => Job, (job) => job.screening_questions)
    @JoinColumn({ name: 'job_id' })
    job?: Job;
}
