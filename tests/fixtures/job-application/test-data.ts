import { ContactType, JobApplicationScoreType } from '@pulsifi/constants';
import {
    JobApplicationActionHistoryDto,
    JobApplicationAttachmentDto,
    JobApplicationCareerDto,
    JobApplicationContactDto,
    JobApplicationDto,
    JobApplicationEducationDto,
    JobApplicationQuestionnaireDto,
    JobApplicationResumeDto,
    JobApplicationScoreDto,
    JobApplicationScreeningAnswerDto,
    PlaceDto,
} from '@pulsifi/dtos';
import { generatorUtil, objectParser } from '@pulsifi/fn';

import {
    candidateAssessment16,
    candidateAssessment30,
} from '../candidate/assessment-30-data';
import {
    candidateApplicationSubmittedPayload,
    candidateCareerPayload,
    candidateEducationPayload,
    candidateProfilePayload,
    candidateScreeningAnswerAttachmentPayload,
    candidateScreeningAnswerPayload,
    jobApplicationId,
} from '../candidate/test-data';

export const jobApplicationAttachmentPayload: JobApplicationAttachmentDto = {
    job_application_id: jobApplicationId,
    file_name: (
        candidateScreeningAnswerAttachmentPayload.answer!.value as string[]
    )[0],
    file_path:
        'candidates/attachments/de77b40e-c084-4ff7-ba17-32c68d3d6e97/Example_transcript.pdf',
};

export const jobApplicationCareer: JobApplicationCareerDto = {
    id: 1,
    job_application_id: jobApplicationId,
    is_current: candidateCareerPayload.is_current,
    organization: candidateCareerPayload.organization,
    role: candidateCareerPayload.role,
    start_date: candidateCareerPayload.start_date,
    end_date: candidateCareerPayload.end_date,
    description: undefined,
    responsibilities_achievements:
        candidateCareerPayload.responsibilities_achievements,
    place_formatted_address: candidateCareerPayload.place_formatted_address,
    place_result: candidateCareerPayload.place_result
        ? new PlaceDto(candidateCareerPayload.place_result)
        : null,
};

export const jobApplicationEmailContact: JobApplicationContactDto = {
    job_application_id: jobApplicationId,
    contact_type: ContactType.EMAIL,
    value: candidateProfilePayload.identity_value,
    is_primary: true,
};

export const jobApplicationPhoneContact: JobApplicationContactDto = {
    job_application_id: jobApplicationId,
    contact_type: ContactType.MOBILE,
    value: `${candidateProfilePayload.phone_code}${candidateProfilePayload.phone_number}`,
    is_primary: true,
};

export const jobApplicationDaxtraEmailContact: JobApplicationContactDto = {
    job_application_id: jobApplicationId,
    contact_type: ContactType.EMAIL,
    value: 'mary.c@emailaddress.co.uk',
    is_primary: false,
};

export const jobApplicationDaxtraMobile1Contact: JobApplicationContactDto = {
    job_application_id: jobApplicationId,
    contact_type: ContactType.MOBILE,
    value: '4424768885544',
    is_primary: false,
};

export const jobApplicationDaxtraMobile2Contact: JobApplicationContactDto = {
    job_application_id: jobApplicationId,
    contact_type: ContactType.MOBILE,
    value: '448872229999',
    is_primary: false,
};

export const jobApplicationEducation: JobApplicationEducationDto = {
    id: 1,
    job_application_id: jobApplicationId,
    parent_id: 0,
    major_first: candidateEducationPayload.major_first,
    major_second: candidateEducationPayload.major_second,
    degree_name: candidateEducationPayload.degree_name,
    school_name: candidateEducationPayload.school_name,
    grade_type: candidateEducationPayload.grade_type,
    grade_value: candidateEducationPayload.grade_value,
    grade_value_max: candidateEducationPayload.grade_value_max,
    grade_description: candidateEducationPayload.grade_description,
    start_date: candidateEducationPayload.start_date,
    end_date: candidateEducationPayload.end_date,
    is_highest: candidateEducationPayload.is_highest,
    description: candidateEducationPayload.description,
    others: candidateEducationPayload.others,
    grade_cgpa: undefined,
    achievements: candidateEducationPayload.achievements,
};

export const jobApplicationResume: JobApplicationResumeDto = {
    id: 1,
    job_application_id: jobApplicationId,
    file_name: 'resume.pdf',
    file_path:
        'candidates/resumes/f65e21b3-dcd0-4285-8beb-2c6f708ea44f/resume.pdf',
    original_file_path:
        'candidates/resumes/87e07537-0179-455a-aa15-2cf254199289/Blank_Resume.docx',
    content_path: candidateApplicationSubmittedPayload.resume_content_path!,
    is_primary: true,
};

export const jobApplicationScorePayload: JobApplicationScoreDto = {
    id: 1,
    job_application_id: jobApplicationId,
    percentile: 88,
    percentile_api_version: 'v1.0',
    percentile_source: 'Pulsifi',
    score_recipe_id: generatorUtil.uuid(),
    score_dimension: 2,
    score_type: JobApplicationScoreType.ROLE_FIT,
    score: 8.1,
    score_outcome: {} as JSON,
};

export const jobApplicationScreeningAnswer: JobApplicationScreeningAnswerDto = {
    job_application_id: jobApplicationId,
    question: objectParser.toJSON(candidateScreeningAnswerPayload.question),
    answer: objectParser.toJSON(candidateScreeningAnswerPayload.answer),
    tag: candidateScreeningAnswerPayload.tag,
    criteria_status: candidateScreeningAnswerPayload.criteria_status,
    attachment_file_id: undefined,
    order_no: candidateScreeningAnswerPayload.order_no,
    job_screening_question_id:
        candidateScreeningAnswerPayload.job_screening_question_id,
};

export const jobApplicationScreeningAnswerAttachment: JobApplicationScreeningAnswerDto =
    {
        job_application_id: jobApplicationId,
        question: objectParser.toJSON(
            candidateScreeningAnswerAttachmentPayload.question,
        ),
        answer: objectParser.toJSON(
            candidateScreeningAnswerAttachmentPayload.answer,
        ),
        tag: candidateScreeningAnswerAttachmentPayload.tag,
        criteria_status:
            candidateScreeningAnswerAttachmentPayload.criteria_status,
        attachment_file_id: 1,
        order_no: candidateScreeningAnswerAttachmentPayload.order_no,
        job_screening_question_id:
            candidateScreeningAnswerAttachmentPayload.job_screening_question_id,
    };

export const jobApplicationResult: JobApplicationDto = {
    id: jobApplicationId,
    ext_candidate_job_application_id: jobApplicationId,
    job_id: candidateApplicationSubmittedPayload.job_id,
    company_id: candidateApplicationSubmittedPayload.company_id,
    completed_at: undefined,
    first_name: candidateProfilePayload.first_name,
    last_name: candidateProfilePayload.last_name,
    place_formatted_address:
        candidateApplicationSubmittedPayload.profile!.place_formatted_address,
    place_result: new PlaceDto(
        objectParser.toJSON(
            candidateApplicationSubmittedPayload.profile!.place_result,
        ),
    ),
    skills: candidateApplicationSubmittedPayload.profile!.skills,
    professional_summary:
        candidateApplicationSubmittedPayload.profile!.professional_summary,
    status: candidateApplicationSubmittedPayload.status!,
    is_questionnaires_required:
        candidateApplicationSubmittedPayload.is_questionnaires_required,
    total_questionnaires_completed:
        candidateApplicationSubmittedPayload.total_questionnaires_completed,
    total_questionnaires:
        candidateApplicationSubmittedPayload.total_questionnaires,
    user_account_id:
        candidateApplicationSubmittedPayload.profile!.user_account_id,
    total_screenings_completed: 0,
    total_screenings: 0,
    is_deleted: false,
    source: undefined,
    submitted_at: undefined,
    last_status_changed_at: new Date(),
    has_passed_screening: true,
    is_video_required: false,
    ext_person_score_id: undefined,
    is_anonymous: false,
};

export const jobApplicationQuestionnaire30: JobApplicationQuestionnaireDto = {
    id: 1,
    job_application_id: jobApplicationId,
    questionnaire_framework: candidateAssessment30.questionnaire_framework,
    questionnaire_id: candidateAssessment30.questionnaire_id,
    attempts: candidateAssessment30.attempts,
    question_answer_raw: objectParser.toJSON(
        candidateAssessment30.question_answer_raw,
    ),
    result_raw: objectParser.toJSON(candidateAssessment30.result_raw),
    started_at: candidateAssessment30.started_at,
    completed_at: candidateAssessment30.completed_at,
};

export const jobApplicationQuestionnaire16: JobApplicationQuestionnaireDto = {
    id: 1,
    job_application_id: jobApplicationId,
    questionnaire_framework: candidateAssessment16.questionnaire_framework,
    questionnaire_id: candidateAssessment16.questionnaire_id,
    attempts: candidateAssessment16.attempts,
    question_answer_raw: objectParser.toJSON(
        candidateAssessment16.question_answer_raw,
    ),
    result_raw: objectParser.toJSON(candidateAssessment16.result_raw),
    started_at: candidateAssessment16.started_at,
    completed_at: candidateAssessment16.completed_at,
};

export const jobApplicationActionHistoryPayload: JobApplicationActionHistoryDto =
    {
        id: 1,
        job_application_id: jobApplicationId,
        action_type: 'status_update',
        value: objectParser.toJSON({ status: 'applied ' }),
        created_username: 'candidate',
    };
