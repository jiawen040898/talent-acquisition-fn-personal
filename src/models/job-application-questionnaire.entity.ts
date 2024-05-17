import {
    DateTimeColumn,
    IntegerColumn,
    JsonColumn,
    UuidColumn,
} from '@pulsifi/fn/decorators/typeorm';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditDataEntity } from './audit-data.entity';
import { JobApplication } from './job-application.entity';

export interface PersonalityTrait {
    trait_id: number;
    trait_score: number;
    trait_alias: string;
    trait_percentile?: number;
    trait_order: number;
}

export interface PersonalityBase {
    domain_id: number;
    domain_alias: string;
    domain_score: number;
    domain_percentile?: number;
}

export interface PersonalityDomain extends PersonalityBase {
    domain_order: number;
    model_type_id?: number;
    model_type?: string;
    traits: PersonalityTrait[];
}

export class ResultRawDto {
    scores?: PersonalityDomain[];
}

@Entity({ name: 'job_application_questionnaire' })
export class JobApplicationQuestionnaire extends AuditDataEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @UuidColumn()
    job_application_id!: string;

    @Column({
        length: 100,
    })
    questionnaire_framework!: string;

    @IntegerColumn()
    questionnaire_id!: number;

    @DateTimeColumn({
        nullable: true,
    })
    started_at?: Date;

    @DateTimeColumn({
        nullable: true,
    })
    completed_at?: Date;

    @IntegerColumn()
    attempts!: number;

    @JsonColumn({ nullable: true })
    question_answer_raw?: JSON;

    @JsonColumn({ nullable: true })
    result_raw?: JSON;

    @ManyToOne(
        () => JobApplication,
        (jobApplication) => jobApplication.questionnaires,
    )
    @JoinColumn({ name: 'job_application_id' })
    job_application?: JobApplication;
}
