import {
    JobApplicationSkillProficiency,
    JobApplicationSkillSource,
} from '@pulsifi/constants';
import {
    CandidateActivity,
    CandidateApplicationSubmitted,
    CandidateApplicationUpdated,
    CandidateAssessment,
    CandidateCareer,
    CandidateEducation,
    CandidatePlaceResult,
    CandidateProfile,
    CandidateScreeningAnswer,
    CandidateScreeningQuestion,
} from '@pulsifi/dtos';
import { generatorUtil } from '@pulsifi/fn';

import { candidateAssessment30 } from './assessment-30-data';

export const jobApplicationId = generatorUtil.uuid();
export const candidateId = generatorUtil.uuid();

export const candidatePlacePayload: CandidatePlaceResult = {
    place_id: 'asdasda',
    display_address:
        'publika, sri hartamas, kuala lumpur, wilayah persekutuan, 58200, malaysia',
    vicinity: 'kuala lumpur',
    street_number: '',
    street_name: 'sri hartamas',
    postal_code: '58200',
    locality: 'kuala lumpur',
    sublocality: 'kuala lumpur',
    state: 'wilayah persekutuan',
    country: 'malaysia',
    geolocation: undefined,
};

export const candidateProfilePayload: CandidateProfile = {
    id: candidateId,
    user_account_id: 1,
    first_name: 'Jess',
    last_name: 'Bezor',
    identity_value: 'tester@pulsifi.me',
    identity_provider: 'auth0',
    phone_number: '123456789',
    phone_code: '60',
    place_formatted_address:
        'publika, sri hartamas, kuala lumpur, wilayah persekutuan, 58200, malaysia',
    place_result: candidatePlacePayload,
    professional_summary: 'This is my professional summary',
    skills: [
        {
            name: 'Python',
            proficiency: JobApplicationSkillProficiency.EXPERT,
            source: JobApplicationSkillSource.CANDIDATE,
        },
        {
            name: 'Angular',
            proficiency: JobApplicationSkillProficiency.EXPERT,
            source: JobApplicationSkillSource.CANDIDATE,
        },
        {
            name: 'NodeJS',
            proficiency: JobApplicationSkillProficiency.EXPERT,
            source: JobApplicationSkillSource.CANDIDATE,
        },
    ],
};

export const candidateCareerPayload: CandidateCareer = {
    id: 1,
    organization: 'pulsifi',
    role: 'software engineer',
    is_current: true,
    start_date: new Date(),
    end_date: new Date(),
    responsibilities_achievements: 'This is my responsibilities & achievements',
    place_formatted_address:
        'publika, sri hartamas, kuala lumpur, wilayah persekutuan, 58200, malaysia',
    place_result: candidatePlacePayload,
};

export const candidateEducationPayload: CandidateEducation = {
    id: 1,
    major_first: 'major_first',
    major_second: 'major_second',
    degree_name: 'degree_name',
    school_name: 'school_name',
    grade_type: 'grade_type',
    grade_value: '1',
    grade_value_max: 2,
    grade_description: 'degree_name',
    start_date: new Date(),
    end_date: new Date(),
    is_highest: true,
    description: 'description',
    others: 'others',
    achievements: 'This is my achievements',
};

export const candidateActivityPayload: CandidateActivity = {
    id: 1,
    is_role_active: true,
    organization: 'pulsifi',
    role: 'QA',
    start_date: new Date(),
    end_date: new Date(),
    description: 'Activity Description',
};

const candidateScreeningQuestionPayload: CandidateScreeningQuestion = {
    id: 1,
    order_no: 1,
    alias: 'question-1',
    schema: {
        title: 'Test question 1',
        required: true,
    },
};

export const candidateScreeningAnswerPayload: CandidateScreeningAnswer = {
    id: 1,
    order_no: 1,
    job_screening_question_id: 1,
    question: candidateScreeningQuestionPayload,
    answer: {
        value: 'answer 123',
    },
    criteria_status: 'pass',
    tag: 'tag1',
};

export const deprecatedCandidateScreeningAnswerAttachmentPayload: CandidateScreeningAnswer =
    {
        id: 1,
        order_no: 2,
        job_screening_question_id: 2,
        question: candidateScreeningQuestionPayload,
        answer: {
            value: {
                file_type: 'application/pdf',
                file_path:
                    'candidates/attachments/de77b40e-c084-4ff7-ba17-32c68d3d6e97/Example_transcript.pdf',
                file_name: 'Example_transcript.pdf',
            },
        },
        tag: undefined,
        criteria_status: 'none',
        attachment_file_path:
            'https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/candidates/attachments/de77b40e-c084-4ff7-ba17-32c68d3d6e97/Example_transcript.pdf',
    };

export const candidateScreeningAnswerAttachmentPayload: CandidateScreeningAnswer =
    {
        id: 1,
        order_no: 2,
        job_screening_question_id: 2,
        question: candidateScreeningQuestionPayload,
        answer: {
            value: [
                'Example_transcript.pdf',
                'candidates/attachments/de77b40e-c084-4ff7-ba17-32c68d3d6e97/Example_transcript.pdf',
                'application/pdf',
            ],
        },
        tag: undefined,
        criteria_status: 'none',
        attachment_file_path:
            'https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/candidates/attachments/de77b40e-c084-4ff7-ba17-32c68d3d6e97/Example_transcript.pdf',
    };

export const candidateApplicationSubmittedPayload: CandidateApplicationSubmitted =
    {
        id: jobApplicationId,
        company_id: 1,
        job_id: generatorUtil.uuid(),
        status: 'applied',
        is_questionnaires_required: true,
        total_questionnaires: 6,
        total_questionnaires_completed: 0,
        profile: candidateProfilePayload,
        is_video_required: false,
        is_anonymous: false,
        resume_original_file_path:
            'https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/candidates/resumes/87e07537-0179-455a-aa15-2cf254199289/Blank_Resume.docx',
        resume_file_path:
            'https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/candidates/resumes/f65e21b3-dcd0-4285-8beb-2c6f708ea44f/resume.pdf',
        resume_content_path:
            'https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/candidates/resumes/8af8819f-d734-4451-93f2-63d541b053be/sample-resume.json',
    };

export const candidateApplicationUpdatedPayload: CandidateApplicationUpdated = {
    job_application_id: jobApplicationId,
    company_id: 1,
    job_id: generatorUtil.uuid(),
    resume_original_file_path:
        'https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/candidates/resumes/87e07537-0179-455a-aa15-2cf254199289/Blank_Resume.docx',
    resume_file_path:
        'https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/candidates/resumes/f65e21b3-dcd0-4285-8beb-2c6f708ea44f/resume.pdf',
    resume_content_path:
        'https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/candidates/resumes/8af8819f-d734-4451-93f2-63d541b053be/sample-resume.json',
    careers: [candidateCareerPayload],
};

export const candidateApplicationUpdatedCareerOnlyPayload: CandidateApplicationUpdated =
    {
        job_application_id: jobApplicationId,
        company_id: 1,
        job_id: generatorUtil.uuid(),
        careers: [candidateCareerPayload],
    };

// https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/candidates/resumes/458d0837-637f-4b67-9edc-310c11a7212f/CHONG_CHEE_YUEN_CV.json

export const candidateAssessmentsPayload: CandidateAssessment[] = [
    candidateAssessment30,
];
