import {
    FitModelType,
    FrameworkType,
    JobApplicationSkillProficiency,
    JobApplicationSkillSource,
} from '@pulsifi/constants';
import { TalentAcquisitionApplicationSubmitted } from '@pulsifi/dtos';
import { TextSummaryResponse } from '@pulsifi/interfaces';
import {
    Job,
    JobApplication,
    JobApplicationActionHistory,
    JobApplicationQuestionnaire,
    JobApplicationScore,
    JobQuestionnaire,
} from '@pulsifi/models';
import {
    testJobApplicationActionHistory,
    testJobApplicationBuilder,
    testJobApplicationQuestionnaire,
    testJobBuilder,
    testJobQuestionnaireBuilder,
} from '@pulsifi/tests/builders';
import { jobApplicationScorePayload } from '@pulsifi/tests/fixtures';
import { jobDistributionScoreTestData } from '@pulsifi/tests/services/fixtures/job-distribution-score-test-data';
import { TestData, testUtil } from '@pulsifi/tests/setup';

const mockDaxtraTextSummary = {
    TextResume: 'programming in python',
};

const mockSkillExtractAPIResponse: TextSummaryResponse = {
    is_resume: true,
    competencies: [
        { skill: 'Organisational Skills', category: 'WorkExperienceSkill' },
    ],
};

const mockSkillExtractAPIResponseWithoutResume: TextSummaryResponse = {
    is_resume: false,
    competencies: [{ skill: 'Python', category: 'Softwares' }],
};

const mockSkillExtractAPIEmptyResponse: TextSummaryResponse = {
    is_resume: false,
    competencies: [],
};

const job = testJobBuilder.build({
    id: testUtil.mockUuid(2),
    role_fit_recipe_id: testUtil.mockUuid(3),
});

const job2 = testJobBuilder.build({
    id: testUtil.mockUuid(4),
    role_fit_recipe_id: testUtil.mockUuid(5),
});

const job2Questionnaires = {
    ...testJobQuestionnaireBuilder.build(),
    job_id: job2.id,
};

const jobApplication = testJobApplicationBuilder.build({
    id: '00000000-0000-0000-9999-000000000001',
    job_id: job.id,
    skills: [
        {
            name: 'Python',
            proficiency: JobApplicationSkillProficiency.EXPERT,
            source: JobApplicationSkillSource.CANDIDATE,
        },
    ],
    professional_summary: 'I have mastered Python programming language',
});

const jobApplication2 = testJobApplicationBuilder.build({
    id: '00000000-0000-0000-9999-000000000002',
    job_id: job.id,
    skills: [],
});

const jobApplication3 = testJobApplicationBuilder.build({
    id: '00000000-0000-0000-9999-000000000003',
    job_id: job.id,
    skills: [
        {
            name: 'Teamwork',
            proficiency: JobApplicationSkillProficiency.EXPERT,
            source: JobApplicationSkillSource.CANDIDATE,
        },
    ],
});

const jobApplication4 = testJobApplicationBuilder.build({
    id: '00000000-0000-0000-9999-000000000004',
    job_id: job.id,
    skills: [],
});

const jobApplication5 = testJobApplicationBuilder.build({
    id: testUtil.mockUuid(6),
    job_id: job2.id,
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
    professional_summary: 'I have mastered Python programming language',
    is_video_required: false,
    total_questionnaires: 1,
    total_questionnaires_completed: 1,
    total_screenings: 0,
    total_screenings_completed: 0,
    ext_candidate_job_application_id: testUtil.mockUuid(7),
    assessment_completed_at: undefined,
});

const jobApplication6 = testJobApplicationBuilder.build({
    id: testUtil.mockUuid(8),
    job_id: job.id,
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
    professional_summary: 'I have mastered Python programming language',
    is_video_required: false,
    is_questionnaires_required: false,
    total_questionnaires: 0,
    total_questionnaires_completed: 0,
    total_screenings: 0,
    total_screenings_completed: 0,
    ext_candidate_job_application_id: testUtil.mockUuid(9),
    assessment_completed_at: undefined,
});

const jobApplication5ActionHistory = testJobApplicationActionHistory.build({
    job_application_id: jobApplication5.id,
});

const jobApplication6ActionHistory = testJobApplicationActionHistory.build({
    job_application_id: jobApplication6.id,
});

const jobApplication5Questionnaire = testJobApplicationQuestionnaire.build({
    job_application_id: jobApplication5.id,
});

const jobApplicationPayload: TalentAcquisitionApplicationSubmitted = {
    job_application_id: jobApplication.id,
    company_id: TestData.companyId,
    job_id: job.id,
    resume: {
        file_name: 'file name',
        file_path: 'file path',
        original_file_path: 'file path',
        is_primary: true,
        content_path: 'https://bucket.s3-aws-region.amazonaws.com/key',
    },
};

const jobApplicationPayload2: TalentAcquisitionApplicationSubmitted = {
    job_application_id: jobApplication2.id,
    company_id: TestData.companyId,
    job_id: job.id,
    resume: {
        file_name: 'file name',
        file_path: 'file path',
        original_file_path: 'file path',
        is_primary: true,
        content_path: 'https://bucket.s3-aws-region.amazonaws.com/key',
    },
};

const jobApplicationPayload3: TalentAcquisitionApplicationSubmitted = {
    job_application_id: jobApplication3.id,
    company_id: TestData.companyId,
    job_id: job.id,
};

const jobApplicationPayload4: TalentAcquisitionApplicationSubmitted = {
    job_application_id: jobApplication4.id,
    company_id: TestData.companyId,
    job_id: job.id,
    resume: {
        file_name: 'file name',
        file_path: 'file path',
        original_file_path: 'file path',
        is_primary: true,
        content_path: 'https://bucket.s3-aws-region.amazonaws.com/key',
    },
};

const mockMachineTokenResponse = {
    data: {
        access_token:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJKTk5aZThSYl94Y2FaTmlpdmhEYyJ9.eyJpc3MiOiJodHRwczovL3NhbmRib3gtZW50ZXJwcmlzZS1pZC5wdWxzaWZpLm1lLyIsInN1YiI6IllWWUZ2VnF3MEJiak51ZGppME9nbUVvUUNmOEEyR2pyQGNsaWVudHMiLCJhdWQiOiJodHRwczovL3NhbmRib3guYXBpLnB1bHNpZmkubWUvIiwiaWF0IjoxNjY4OTk5MjE2LCJleHAiOjE2NjkwODU2MTYsImF6cCI6IllWWUZ2VnF3MEJiak51ZGppME9nbUVvUUNmOEEyR2pyIiwic2NvcGUiOiJjcmVhdGU6ZW1wbG95ZWVfdXNlcl9hY2NvdW50cyByZWFkOmlkZW50aXR5X3VzZXJzIGRlbGV0ZTppZGVudGl0eV91c2VycyByZWFkOmlkZW50aXR5X2NvbXBhbmllcyB1cGRhdGU6aWRlbnRpdHlfdXNlcnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJwZXJtaXNzaW9ucyI6WyJjcmVhdGU6ZW1wbG95ZWVfdXNlcl9hY2NvdW50cyIsInJlYWQ6aWRlbnRpdHlfdXNlcnMiLCJkZWxldGU6aWRlbnRpdHlfdXNlcnMiLCJyZWFkOmlkZW50aXR5X2NvbXBhbmllcyIsInVwZGF0ZTppZGVudGl0eV91c2VycyJdfQ.z906KnY5UVbW3pETCxAongu6FDfakXv_9zU_oYErap_pbVVUI7kXqXRkrB2R46Av_CCFMg5tWrK3wDOiVG_2kU9myWIB5_ogAZC4CxyyP3KLM9na3InS4qa6dgzIcnyz4laFocKIndisMrGWTmRJGhRBH3wQarv9dlm32AHQHU8MVGmlGwZaPIjmAmBfGfa3DoWYZYVNAILw2cbg5q6QkE7OIx7LNwBVvvcubZazxew3rUhCsYgo7ARcgyPQGS3kW7CtviwuPRbEGELSTvYl82odJf58hANMEne8jggP4gqDLBSEGpPBwK_2r9yq4ALyBjKMxY3a-gS4bHQPfxxCDw',
        scope: 'create:employee_user_accounts read:identity_users delete:identity_users read:identity_companies update:identity_users',
        expires_in: 86400,
        token_type: 'Bearer',
    },
};

const mockAuth0CredentialSecretResponse = {
    AUTH0_ENTERPRISE_M2M_CLIENT_ID: 'xxx',
    AUTH0_ENTERPRISE_M2M_CLIENT_SECRET: 'xxx',
};

const ingredientsAndAttributeTest1 = {
    weightage: 0.2,
    ingredient_attribute: null,
};

const ingredientsAndAttributeTest2 = {
    weightage: 0.2,
    ingredient_attribute: null,
};

const ingredientsAndAttributeTest3 = {
    weightage: 0.1428571,
    ingredient_attribute: null,
};

const ingredientsAndAttributeTest4 = {
    weightage: 0.125,
    ingredient_attribute: null,
    ingredient_framework: null,
    ingredient_group: 'recipe',
};

const ingredientsAndAttributeTest5 = {
    weightage: 0.33333,
    ingredient_attribute: null,
    ingredient_framework: null,
};

const resultsDrivenAndWorkValue = {
    ingredient_group: 'results_driven',
    ingredient_framework: 'work_value',
};

const resultsDrivenAndWorkStyle = {
    ingredient_group: 'results_driven',
    ingredient_framework: 'work_style',
};

const inSyncAndWorkStyle = {
    ingredient_group: 'in_sync',
    ingredient_framework: 'work_style',
};

const stakeholderSavvyWorkStyle = {
    ingredient_group: 'stakeholder_savvy',
    ingredient_framework: 'work_style',
};

const learningAndWorkStyle = {
    ingredient_group: 'learning',
    ingredient_framework: 'work_style',
};

const ownershipAndWorkValue = {
    ingredient_group: 'ownership',
    ingredient_framework: 'work_value',
};

const ownershipAndWorkStyle = {
    ingredient_group: 'ownership',
    ingredient_framework: 'work_style',
};

const peopleCentricAndWorkStyle = {
    ingredient_group: 'people_centric',
    ingredient_framework: 'work_style',
};

const peopleCentricAndWorkInterest = {
    ingredient_group: 'people_centric',
    ingredient_framework: 'work_interest',
};

const avantGardeAndWorkStyle = {
    ingredient_group: 'avant_garde',
    ingredient_framework: 'work_style',
};

const avantGardeAndWorkValue = {
    ingredient_group: 'avant_garde',
    ingredient_framework: 'work_value',
};

const cultureFitRecipe = [
    {
        ingredient_alias: 'social',
        ...ingredientsAndAttributeTest1,
        ...peopleCentricAndWorkInterest,
    },
    {
        ...peopleCentricAndWorkInterest,
        ingredient_alias: 'support',
        ...ingredientsAndAttributeTest1,
        ingredient_framework: 'work_value',
    },
    {
        ingredient_alias: 'cooperation',
        ...ingredientsAndAttributeTest1,
        ...peopleCentricAndWorkStyle,
    },
    {
        ingredient_alias: 'concern_for_others',
        ...ingredientsAndAttributeTest1,
        ...peopleCentricAndWorkStyle,
    },
    {
        ingredient_alias: 'social_orientation',
        ...ingredientsAndAttributeTest1,
        ...peopleCentricAndWorkStyle,
    },
    {
        ...ownershipAndWorkValue,
        ingredient_alias: 'investigative',
        ...ingredientsAndAttributeTest1,
        ingredient_framework: 'work_interest',
    },
    {
        ingredient_alias: 'independence',
        ...ingredientsAndAttributeTest1,
        ...ownershipAndWorkValue,
    },
    {
        ingredient_alias: 'relationships',
        ...ingredientsAndAttributeTest1,
        ...ownershipAndWorkValue,
    },
    {
        ingredient_alias: 'leadership',
        ...ingredientsAndAttributeTest1,
        ...ownershipAndWorkStyle,
    },
    {
        ingredient_alias: 'integrity',
        ...ingredientsAndAttributeTest1,
        ...ownershipAndWorkStyle,
    },
    {
        ...learningAndWorkStyle,
        ingredient_alias: 'working_conditions',
        ...ingredientsAndAttributeTest2,
        ingredient_framework: 'work_value',
    },
    {
        ingredient_alias: 'achievement_effort',
        ...ingredientsAndAttributeTest2,
        ...learningAndWorkStyle,
    },
    {
        ingredient_alias: 'initiative',
        ...ingredientsAndAttributeTest2,
        ...learningAndWorkStyle,
    },
    {
        ingredient_alias: 'independence',
        ...ingredientsAndAttributeTest2,
        ...learningAndWorkStyle,
    },
    {
        ...avantGardeAndWorkValue,
        ingredient_alias: 'realistic',
        ...ingredientsAndAttributeTest3,
        ingredient_framework: 'work_interest',
    },
    {
        ...avantGardeAndWorkValue,
        ingredient_alias: 'reasoning_logical',
        ...ingredientsAndAttributeTest3,
        ingredient_framework: null,
    },
    {
        ingredient_alias: 'independence',
        ...ingredientsAndAttributeTest3,
        ...avantGardeAndWorkValue,
    },
    {
        ingredient_alias: 'working_conditions',
        ...ingredientsAndAttributeTest3,
        ...avantGardeAndWorkValue,
    },
    {
        ingredient_alias: 'adaptability_flexibility',
        ...ingredientsAndAttributeTest3,
        ...avantGardeAndWorkStyle,
    },
    {
        ingredient_alias: 'innovation',
        ...ingredientsAndAttributeTest3,
        ...avantGardeAndWorkStyle,
    },
    {
        ingredient_alias: 'analytical_thinking',
        ...ingredientsAndAttributeTest3,
        ...avantGardeAndWorkStyle,
    },
    {
        ingredient_alias: 'achievement',
        ...ingredientsAndAttributeTest1,
        ...resultsDrivenAndWorkValue,
    },
    {
        ingredient_alias: 'recognition',
        ...ingredientsAndAttributeTest1,
        ...resultsDrivenAndWorkValue,
    },
    {
        ingredient_alias: 'achievement_effort',
        ...ingredientsAndAttributeTest1,
        ...resultsDrivenAndWorkStyle,
    },
    {
        ingredient_alias: 'persistence',
        ...ingredientsAndAttributeTest1,
        ...resultsDrivenAndWorkStyle,
    },
    {
        ingredient_alias: 'dependability',
        ...ingredientsAndAttributeTest1,
        ...resultsDrivenAndWorkStyle,
    },
    {
        ingredient_group: 'in_sync',
        ingredient_alias: 'support',
        ...ingredientsAndAttributeTest2,
        ingredient_framework: 'work_value',
    },
    {
        ingredient_alias: 'concern_for_others',
        ...ingredientsAndAttributeTest2,
        ...inSyncAndWorkStyle,
    },
    {
        ingredient_alias: 'self_control',
        ...ingredientsAndAttributeTest2,
        ...inSyncAndWorkStyle,
    },
    {
        ingredient_alias: 'stress_tolerance',
        ...ingredientsAndAttributeTest2,
        ...inSyncAndWorkStyle,
    },
    {
        ingredient_group: 'stakeholder_savvy',
        ingredient_alias: 'enterprising',
        ...ingredientsAndAttributeTest1,
        ingredient_framework: 'work_interest',
    },
    {
        ingredient_group: 'stakeholder_savvy',
        ingredient_alias: 'relationships',
        ...ingredientsAndAttributeTest1,
        ingredient_framework: 'work_value',
    },
    {
        ingredient_alias: 'leadership',
        ...ingredientsAndAttributeTest1,
        ...stakeholderSavvyWorkStyle,
    },
    {
        ingredient_alias: 'social_orientation',
        ...ingredientsAndAttributeTest1,
        ...stakeholderSavvyWorkStyle,
    },
    {
        ingredient_alias: 'self_control',
        ...ingredientsAndAttributeTest1,
        ...stakeholderSavvyWorkStyle,
    },
    {
        ingredient_group: 'plus',
        ingredient_alias: 'reasoning_verbal',
        ...ingredientsAndAttributeTest5,
    },
    {
        ingredient_group: 'plus',
        ingredient_alias: 'reasoning_logical',
        ...ingredientsAndAttributeTest5,
    },
    {
        ingredient_group: 'plus',
        ingredient_alias: 'reasoning_numeric',
        ...ingredientsAndAttributeTest5,
    },
    {
        ingredient_alias: 'people_centric',
        ...ingredientsAndAttributeTest4,
    },
    {
        ingredient_alias: 'ownership',
        ...ingredientsAndAttributeTest4,
    },
    {
        ingredient_alias: 'learning',
        ...ingredientsAndAttributeTest4,
    },
    {
        ingredient_alias: 'avant_garde',
        ...ingredientsAndAttributeTest4,
    },
    {
        ingredient_alias: 'results_driven',
        ...ingredientsAndAttributeTest4,
    },
    {
        ingredient_alias: 'in_sync',
        ...ingredientsAndAttributeTest4,
    },
    {
        ingredient_alias: 'stakeholder_savvy',
        ...ingredientsAndAttributeTest4,
    },
    {
        ingredient_alias: 'plus',
        ...ingredientsAndAttributeTest4,
    },
];

const questionnaires = [
    {
        questionnaire_framework: 'personality',
        questionnaire_id: 30,
    },
    {
        questionnaire_framework: 'work_interest',
        questionnaire_id: 25,
    },
];

const mockGetFitScoreRecipe = {
    data: {
        data: {
            id: testUtil.mockUuid(1),
            company_id: TestData.companyId,
            fit_score_type: FrameworkType.CULTURE_FIT,
            fit_model_type: FitModelType.TEMPLATE,
            job_title: null,
            job_competency: [],
            recipe: cultureFitRecipe,
            questionnaire: questionnaires,
            competency_inclusiveness: false,
            framework_alias: null,
        },
    },
};

const mockGetPairwiseSimilarityHardSkill = {
    data: {
        score: 0.521033439371321,
        pairwise_score: {
            Liaising: {
                Career: 0.26674896478652954,
                Design: 0.3413463830947876,
                Communication: 0.5105934739112854,
            },
        },
    },
};

const mockGetPairwiseSimilarityWorkExperience = {
    data: {
        pairwise_result: [
            {
                previous_employment: 'BUSINESS MANAGER',
                matches: [
                    {
                        job_title: 'Engineer',
                        score: 0.33818328380584717,
                    },
                ],
            },
        ],
    },
};

const mockJobApplicationScore: JobApplicationScore = {
    ...jobApplicationScorePayload,
    score_type: jobDistributionScoreTestData.score_type,
    score: 7,
    created_by: 1,
    updated_by: 1,
};

const entitiesToBeAdded = [
    {
        entityClass: Job,
        data: [job, job2],
    },
    {
        entityClass: JobQuestionnaire,
        data: [job2Questionnaires],
    },
    {
        entityClass: JobApplication,
        data: [
            jobApplication,
            jobApplication2,
            jobApplication3,
            jobApplication4,
            jobApplication5,
            jobApplication6,
        ],
    },
    {
        entityClass: JobApplicationActionHistory,
        data: [jobApplication5ActionHistory, jobApplication6ActionHistory],
    },
    {
        entityClass: JobApplicationQuestionnaire,
        data: [jobApplication5Questionnaire],
    },
];

export const testData = {
    mockSkillExtractAPIResponse,
    mockSkillExtractAPIResponseWithoutResume,
    mockSkillExtractAPIEmptyResponse,
    entitiesToBeAdded,
    jobApplication,
    jobApplication2,
    jobApplication4,
    jobApplication5,
    jobApplication6,
    jobApplicationPayload,
    jobApplicationPayload2,
    jobApplicationPayload3,
    jobApplicationPayload4,
    mockDaxtraTextSummary,
    jobDistributionScoreTestData,
    mockMachineTokenResponse,
    mockAuth0CredentialSecretResponse,
    mockGetFitScoreRecipe,
    mockGetPairwiseSimilarityHardSkill,
    mockGetPairwiseSimilarityWorkExperience,
    mockJobApplicationScore,
};
