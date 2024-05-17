import { AssessmentInviteOption } from '@pulsifi/constants';
import { generatorUtil } from '@pulsifi/fn';
import { Job, JobQuestionnaire } from '@pulsifi/models';
import { TestData } from '@pulsifi/tests/setup';
import * as Factory from 'factory.ts';

export const testJobBuilder = Factory.Sync.makeFactory<Job>({
    id: generatorUtil.uuid(),
    company_id: 5,
    title: 'Tester',
    role: 'QA',
    status: 'active',
    employment_type: '',
    application_form: {
        resume: true,
        profile: true,
        work_experience: true,
        education: true,
        additional: false,
        review: true,
    },
    assessment_invite_option: AssessmentInviteOption.ALL,
    video_invite_option: 'all',
    is_video_deployed: true,
    role_fit_recipe_id: generatorUtil.uuid(),
    culture_fit_recipe_id: generatorUtil.uuid(),
    screening_questions: [],
    created_by: TestData.createdBy,
    created_at: TestData.now,
    updated_by: TestData.createdBy,
    updated_at: TestData.now,
});

export const testJobQuestionnaireBuilder =
    Factory.Sync.makeFactory<JobQuestionnaire>({
        id: 1,
        job_id: '00000000-0000-0000-0000-000000000001',
        questionnaire_framework: 'personality',
        questionnaire_id: 30,
        language: 'en-US',
        ...TestData.auditData,
    });
