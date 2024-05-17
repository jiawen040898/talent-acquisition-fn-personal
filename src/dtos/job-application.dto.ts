import { objectParser } from '@pulsifi/fn';
import { JobApplicationSkill } from '@pulsifi/interfaces';
import { JobApplication } from '@pulsifi/models';

import { JobApplicationActionHistoryDto } from './job-application-action-history.dto';
import { JobApplicationAttachmentDto } from './job-application-attachment.dto';
import { JobApplicationCareerDto } from './job-application-career.dto';
import { JobApplicationContactDto } from './job-application-contact.dto';
import { JobApplicationEducationDto } from './job-application-education.dto';
import { JobApplicationQuestionnaireDto } from './job-application-questionnaire.dto';
import { JobApplicationResumeDto } from './job-application-resume.dto';
import { JobApplicationScoreDto } from './job-application-score.dto';
import { JobApplicationScreeningAnswerDto } from './job-application-screening-answer.dto';
import { PlaceDto } from './place.dto';

export class JobApplicationDto {
    id?: string;
    job_id!: string;
    company_id!: number;
    ext_candidate_job_application_id?: string;
    user_account_id!: number;
    status!: string;
    last_status_changed_at: Date;
    first_name?: string;
    last_name?: string;
    place_formatted_address?: string;
    place_result?: PlaceDto;
    source?: string;
    professional_summary?: string | null;
    skills?: JobApplicationSkill[] | null;
    nationality?: string;
    is_questionnaires_required: boolean;
    total_questionnaires_completed: number;
    total_questionnaires: number;
    total_screenings_completed: number;
    total_screenings: number;
    assessment_completion_percentage?: number;
    has_passed_screening: boolean;
    criteria_met_percentage?: number;
    role_fit_score?: number;
    culture_fit_score?: number;
    submitted_at?: Date;
    completed_at?: Date;
    assessment_completed_at?: Date | null;
    assessment_started_at?: Date;
    is_deleted: boolean;
    is_video_required: boolean;
    ext_person_score_id?: string;
    is_anonymous?: boolean;
    ext_reference_id?: string;
    primary_contact_email?: string;

    action_histories?: JobApplicationActionHistoryDto[];
    attachments?: JobApplicationAttachmentDto[];
    careers?: JobApplicationCareerDto[];
    contacts?: JobApplicationContactDto[];
    educations?: JobApplicationEducationDto[];
    questionnaires?: JobApplicationQuestionnaireDto[];
    resumes?: JobApplicationResumeDto[];
    scores?: JobApplicationScoreDto[];
    screening_answers?: JobApplicationScreeningAnswerDto[];

    constructor(input: JobApplication) {
        this.id = input.id;
        this.job_id = input.job_id;
        this.company_id = input.company_id;
        this.user_account_id = input.user_account_id;
        this.status = input.status;
        this.last_status_changed_at = input.last_status_changed_at;
        this.first_name = input.first_name;
        this.last_name = input.last_name;
        this.place_formatted_address = input.place_formatted_address;
        this.place_result = input.place_result
            ? new PlaceDto(input.place_result)
            : undefined;
        this.source = input.source;
        this.skills = input.skills;
        this.professional_summary = input.professional_summary;
        this.is_questionnaires_required = Boolean(
            input.is_questionnaires_required,
        );
        this.total_questionnaires_completed =
            input.total_questionnaires_completed;
        this.total_questionnaires = input.total_questionnaires;
        this.total_screenings_completed = input.total_screenings_completed;
        this.total_screenings = input.total_screenings;
        this.submitted_at = input.submitted_at;
        this.completed_at = input.completed_at;
        this.assessment_completed_at = input.assessment_completed_at;
        this.assessment_started_at = input.assessment_started_at;
        this.ext_candidate_job_application_id =
            input.ext_candidate_job_application_id;
        this.is_deleted = Boolean(input.is_deleted);
        this.has_passed_screening = Boolean(input.has_passed_screening);
        this.is_video_required = Boolean(input.is_video_required);
        this.ext_person_score_id = input.ext_person_score_id
            ? input.ext_person_score_id
            : undefined;
        this.ext_reference_id = input.ext_reference_id;
        this.is_anonymous = input.is_anonymous;
        this.primary_contact_email = input.primary_contact_email;

        this.action_histories = objectParser.toDtos(
            input.action_histories,
            JobApplicationActionHistoryDto,
        );
        this.attachments = objectParser.toDtos(
            input.attachments,
            JobApplicationAttachmentDto,
        );

        this.careers = objectParser.toDtos(
            input.careers,
            JobApplicationCareerDto,
        );
        this.contacts = objectParser.toDtos(
            input.contacts,
            JobApplicationContactDto,
        );
        this.educations = objectParser.toDtos(
            input.educations,
            JobApplicationEducationDto,
        );
        this.resumes = objectParser.toDtos(
            input.resumes,
            JobApplicationResumeDto,
        );
        this.scores = objectParser.toDtos(input.scores, JobApplicationScoreDto);
        this.screening_answers = objectParser.toDtos(
            input.screening_answers,
            JobApplicationScreeningAnswerDto,
        );
        this.questionnaires = objectParser.toDtos(
            input.questionnaires,
            JobApplicationQuestionnaireDto,
        );
    }
}
