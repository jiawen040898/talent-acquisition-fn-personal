import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';
import { JobApplication } from './job-application.entity';
import { JobApplicationAttachment } from './job-application-attachment.entity';

@Entity({ name: 'job_application_screening_answer' })
export class JobApplicationScreeningAnswer extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    company_id!: number;

    @Column({
        type: 'uuid',
    })
    job_application_id!: string;

    @Column()
    job_screening_question_id!: number;

    @Column()
    order_no!: number;

    @Column('simple-json')
    question!: JSON;

    @Column('simple-json')
    answer!: JSON;

    @Column({
        length: 255,
        nullable: true,
    })
    tag?: string;

    @Column()
    criteria_status!: string;

    @Column({
        nullable: true,
    })
    attachment_file_id?: number;

    @Column({
        nullable: true,
        default: 0,
    })
    question_hash_code?: number;

    @OneToOne(() => JobApplicationAttachment)
    @JoinColumn({ name: 'attachment_file_id' })
    attachment?: JobApplicationAttachment;

    @ManyToOne(
        () => JobApplication,
        (jobApplication) => jobApplication.screening_answers,
    )
    @JoinColumn({ name: 'job_application_id' })
    job_application?: JobApplication;
}
