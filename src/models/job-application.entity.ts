import { ChannelType, JobApplicationStatus } from '@pulsifi/constants';
import {
    DateTimeColumn,
    DecimalColumn,
    IntegerColumn,
    JsonColumn,
    SoftDeleteColumn,
    UuidColumn,
} from '@pulsifi/fn/decorators/typeorm';
import { JobApplicationSkill } from '@pulsifi/interfaces';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';
import { Job } from './job.entity';
import { JobApplicationActionHistory } from './job-application-action-history.entity';
import { JobApplicationAttachment } from './job-application-attachment.entity';
import { JobApplicationCareer } from './job-application-career.entity';
import { JobApplicationContact } from './job-application-contact.entity';
import { JobApplicationEducation } from './job-application-education.entity';
import { JobApplicationLabel } from './job-application-label.entity';
import { JobApplicationQuestionnaire } from './job-application-questionnaire.entity';
import { JobApplicationResume } from './job-application-resume.entity';
import { JobApplicationScore } from './job-application-score.entity';
import { JobApplicationScreeningAnswer } from './job-application-screening-answer.entity';

@Entity({ name: 'job_application' })
export class JobApplication extends AuditDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @UuidColumn()
    job_id!: string;

    @IntegerColumn()
    company_id!: number;

    @UuidColumn({
        nullable: true,
    })
    ext_candidate_job_application_id?: string;

    @IntegerColumn()
    user_account_id!: number;

    @Column({
        default: JobApplicationStatus.APPLIED,
        enum: JobApplicationStatus,
    })
    status!: JobApplicationStatus;

    @DateTimeColumn({
        default: () => 'CURRENT_TIMESTAMP',
    })
    last_status_changed_at!: Date;

    @Column({
        length: 255,
    })
    first_name!: string;

    @Column({
        length: 255,
        nullable: true,
    })
    last_name?: string;

    @Column({
        length: 255,
        nullable: true,
    })
    place_formatted_address?: string;

    @JsonColumn({
        nullable: true,
    })
    place_result?: JSON;

    @JsonColumn({
        nullable: true,
    })
    skills?: JobApplicationSkill[] | null;

    @Column({ type: 'text', nullable: true })
    professional_summary?: string | null;

    @Column({
        length: 255,
        nullable: true,
    })
    source?: string;

    @Column({
        length: 80,
        nullable: true,
    })
    nationality?: string;

    @Column()
    is_questionnaires_required!: boolean;

    @IntegerColumn()
    total_questionnaires_completed!: number;

    @IntegerColumn()
    total_questionnaires!: number;

    @IntegerColumn()
    total_screenings_completed!: number;

    @IntegerColumn()
    total_screenings!: number;

    @Column({
        default: false,
    })
    is_video_required?: boolean;

    @DecimalColumn({
        nullable: true,
    })
    assessment_completion_percentage?: number;

    @Column({
        default: false,
    })
    has_passed_screening?: boolean;

    @DecimalColumn({
        nullable: true,
    })
    criteria_met_percentage?: number;

    @DecimalColumn({
        nullable: true,
    })
    role_fit_score?: number;

    @DecimalColumn({
        nullable: true,
    })
    culture_fit_score?: number;

    @DateTimeColumn({
        nullable: true,
    })
    submitted_at?: Date;

    @DateTimeColumn({
        nullable: true,
    })
    assessment_started_at?: Date;

    @DateTimeColumn({
        nullable: true,
    })
    assessment_completed_at?: Date | null;

    @DateTimeColumn({
        nullable: true,
    })
    completed_at?: Date;

    @DateTimeColumn({
        nullable: true,
    })
    drop_out_at?: Date;

    @DateTimeColumn({
        nullable: true,
    })
    seen_at?: Date;

    @SoftDeleteColumn({
        default: 0,
    })
    is_deleted?: boolean;

    @UuidColumn({
        nullable: true,
    })
    ext_person_score_id?: string;

    @Column({
        length: 50,
        nullable: true,
    })
    ext_reference_id?: string;

    @Column({
        nullable: true,
        default: false,
    })
    is_anonymous?: boolean;

    @Column({
        default: ChannelType.APPLIED,
        enum: ChannelType,
    })
    channel!: ChannelType;

    @Column({
        nullable: true,
    })
    drop_out_reason?: string;

    @Column({
        nullable: true,
    })
    primary_contact_email?: string;

    @UuidColumn({
        nullable: true,
    })
    ext_employee_id?: string;

    @ManyToOne(() => Job, (job) => job.job_applications)
    @JoinColumn({ name: 'job_id' })
    job?: Job;

    @OneToMany(() => JobApplicationCareer, (career) => career.job_application)
    careers?: JobApplicationCareer[];

    @OneToMany(
        () => JobApplicationContact,
        (contact) => contact.job_application,
    )
    contacts?: JobApplicationContact[];

    @OneToMany(
        () => JobApplicationEducation,
        (education) => education.job_application,
    )
    educations?: JobApplicationEducation[];

    @OneToMany(
        () => JobApplicationQuestionnaire,
        (questionnaire) => questionnaire.job_application,
    )
    questionnaires?: JobApplicationQuestionnaire[];

    @OneToMany(
        () => JobApplicationScreeningAnswer,
        (screeningAnswer) => screeningAnswer.job_application,
    )
    screening_answers?: JobApplicationScreeningAnswer[];

    @OneToMany(() => JobApplicationScore, (score) => score.job_application)
    scores?: JobApplicationScore[];

    @OneToMany(() => JobApplicationResume, (resume) => resume.job_application)
    resumes?: JobApplicationResume[];

    @OneToMany(
        () => JobApplicationAttachment,
        (attachment) => attachment.job_application,
    )
    attachments?: JobApplicationAttachment[];

    @OneToMany(
        () => JobApplicationActionHistory,
        (actionHistory) => actionHistory.job_application,
    )
    action_histories?: JobApplicationActionHistory[];

    @OneToMany(() => JobApplicationLabel, (label) => label.job_application)
    labels?: JobApplicationLabel[];
}
