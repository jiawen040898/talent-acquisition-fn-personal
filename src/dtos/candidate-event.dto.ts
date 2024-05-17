import { JobApplicationSkill } from '@pulsifi/interfaces';

export class CandidatePlaceResult {
    place_id?: string;
    display_address?: string;
    vicinity?: string;
    street_number?: string;
    street_name?: string;
    postal_code?: string;
    locality?: string;
    sublocality?: string;
    state?: string;
    country?: string;
    geolocation?: {
        latitude: number;
        longitude: number;
    };
}

export class CandidateProfile {
    id!: string;
    user_account_id!: number;
    first_name?: string;
    last_name?: string;
    identity_value?: string;
    identity_provider?: string | null;
    source?: string | null;
    nationality?: string | null;
    phone_number?: string | null;
    phone_code?: string | null;
    ethnicity?: string | null;
    gender?: string | 'female' | 'male' | 'others' | 'prefer_not_say' | null;
    date_of_birth?: Date | null;
    place_formatted_address?: string;
    place_result?: CandidatePlaceResult | null;
    privacy?: CandidatePrivacy | null;
    professional_summary?: string | null;
    skills?: JobApplicationSkill[] | null;
}

export class CandidatePrivacy {
    date_of_birth?: Date | null;
    ethnicity?: string | null;
    gender?: string | null;
}

export class CandidateCareer {
    id!: number;
    organization!: string;
    role!: string;
    is_current!: boolean;
    start_date?: Date;
    end_date?: Date;
    description?: string; // deprecated
    responsibilities_achievements?: string | null;
    place_formatted_address?: string | null;
    place_result?: CandidatePlaceResult | null;
}

export class CandidateEducation {
    id!: number;
    major_first?: string;
    major_second?: string;
    degree_name?: string;
    school_name?: string;
    grade_type?: string;
    grade_value?: string;
    grade_value_max?: number;
    grade_description?: string;
    grade_cgpa?: number;
    is_highest!: boolean;
    start_date?: Date;
    end_date?: Date;
    description?: string; // deprecated
    others?: string;
    achievements?: string | null;
}

export class CandidateActivity {
    id!: number;
    organization!: string;
    role!: string;
    is_role_active!: boolean;
    start_date?: Date;
    end_date?: Date;
    description?: string;
}

export class CandidateAssessmentAnswer {
    question_code!: number;
    score!: number;
    answer_at?: Date | null;
}

export class CandidateScreeningAttachmentAnswer {
    // file_type!: string;
    file_path!: string;
    file_name!: string;

    constructor(input: JsonObject) {
        // this.file_type = input['file_type'];
        this.file_path = input['file_path'];
        this.file_name = input['file_name'];
    }
}
export class CandidateScreeningQuestion {
    id!: number;
    order_no!: number;
    alias!: string;
    schema!: {
        title?: string | null;
        required?: boolean | null;
    };
}
export class CandidateScreeningAnswer {
    id!: number;
    order_no!: number;
    job_screening_question_id!: number;
    question!: CandidateScreeningQuestion;
    answer?: {
        value?:
            | string
            | string[]
            | Record<string, SafeAny>
            | CandidateScreeningAttachmentAnswer;
    };

    criteria_status!: string | 'none' | 'fail' | 'pass';
    tag?: string;
    attachment_file_path?: string;
}

export class CandidateAssessmentVideoAnswer {
    video_question_id!: number;
    question_id!: number;
    question!: string;
    video_url!: string;
    video_source_id!: number;
    thumbnail_url!: string;
}

export class CandidateAssessmentTraitResult {
    trait_id!: number;
    trait_score!: number;
    trait_alias!: string;
    trait_percentile?: number;
    trait_order?: number;
}

export class CandidateAssessmentDomainResult {
    domain_id!: number;
    domain_alias!: string;
    domain_score!: number;
    domain_percentile?: number;
    domain_order?: number;
    model_type_id?: number;
    traits?: CandidateAssessmentTraitResult[];
}

export class QuestionAnswerRaw {
    answers?: CandidateAssessmentAnswer[] | null;
    video_answers?: CandidateAssessmentVideoAnswer[] | null;
}

export class ResultRaw {
    scores?: CandidateAssessmentDomainResult[] | null;
}

export class CandidateAssessment {
    id!: number;
    questionnaire_id!: number;
    questionnaire_framework!:
        | string
        | 'personality'
        | 'work_interest'
        | 'work_value'
        | 'reasoning_logical'
        | 'reasoning_numeric'
        | 'reasoning_verbal';

    started_at?: Date;
    completed_at?: Date;
    attempts!: number;
    question_answer_raw?: QuestionAnswerRaw;
    result_raw?: ResultRaw;
}

export class CandidateApplicationCompleted {
    id!: string;
    company_id!: number;
    job_id!: string;
    job_title?: string | null;
    status?: string;
    is_questionnaires_required!: boolean;
    total_questionnaires!: number;
    total_questionnaires_completed!: number;
    is_video_required!: boolean;
    submitted_at?: Date | null;
    assessment_completed_at?: Date | null;
    completed_at?: Date;
    ext_reference_id?: string | null;
    is_anonymous!: boolean;
    profile?: CandidateProfile;
}

export class CandidateApplicationAssessmentCompleted {
    id!: string;
    company_id!: number;
    job_id!: string;
    job_title?: string | null;
    status!: string;
    is_questionnaires_required!: boolean;
    total_questionnaires!: number;
    total_questionnaires_completed!: number;
    is_video_required!: boolean;
    submitted_at?: Date | null;
    completed_at?: Date | null;
    profile!: CandidateProfile;
}

export class CandidateApplicationSubmitted extends CandidateApplicationCompleted {
    resume_original_file_path?: string | null;
    resume_file_path?: string | null;
    resume_content_path?: string | null;
    careers?: CandidateCareer[] | null;
    educations?: CandidateEducation[] | null;
    activities?: CandidateActivity[] | null;
    screening_answers?: CandidateScreeningAnswer[] | null;
    assessments?: CandidateAssessment[] | null;
}

export class CandidateApplicationAssessmentSubmitted extends CandidateAssessment {
    company_id!: number;
    job_application_id!: string;
}

export class CandidateApplicationUpdated {
    company_id!: number;
    job_id!: string;
    job_application_id?: string;
    resume_original_file_path?: string | null;
    resume_file_path?: string | null;
    resume_content_path?: string | null;
    careers?: CandidateCareer[] | null;
    screening_answers?: CandidateScreeningAnswer[] | null;
}

export class CandidateApplicationWithdrawn {
    id!: string;
    company_id!: number;
    job_id!: string;
    job_title?: string | null;
    status!: string;
    withdrawn_reason!: string;
    withdrawn_at!: Date;
}

export class CandidateApplicationAssessmentStarted extends CandidateAssessment {
    company_id!: number;
    job_application_id?: string;
}
