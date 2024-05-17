import {
    ApplicationTimeline,
    ChannelType,
    JobApplicationStatus,
    QuestionnaireFramework,
} from '@pulsifi/constants';
import { PlaceDto } from '@pulsifi/dtos';
import { generatorUtil, objectParser } from '@pulsifi/fn';
import {
    JobApplication,
    JobApplicationActionHistory,
    JobApplicationCareer,
    JobApplicationQuestionnaire,
} from '@pulsifi/models';
import { TestData } from '@pulsifi/tests/setup';
import * as Factory from 'factory.ts';

const placeDto: PlaceDto = {
    place_id: 'place_id',
    display_address: 'display_address',
    vicinity: 'vicinity',
    street_number: 'street_number',
    street_name: 'street_name',
    postal_code: 'postal_code',
    locality: 'locality',
    sublocality: 'sublocality',
    state: 'state',
    country: 'country',
    geolocation: {
        latitude: '39.19109830',
        longitude: '-106.81753870',
    },
};

export const testJobApplicationBuilder =
    Factory.Sync.makeFactory<JobApplication>({
        id: Factory.each(() => generatorUtil.uuid()),
        job_id: generatorUtil.uuid(),
        company_id: 5,
        ext_candidate_job_application_id: generatorUtil.uuid(),
        user_account_id: 7,
        status: JobApplicationStatus.APPLIED,
        last_status_changed_at: TestData.now,
        first_name: 'Simon',
        last_name: 'Peter',
        place_formatted_address: '1 Pulsifi Road, Pulsifi Garden, 49990, KL.',
        place_result: objectParser.toJSON(placeDto),
        source: 'Pulsifi',
        nationality: 'Malaysian',
        is_questionnaires_required: true,
        is_video_required: true,
        has_passed_screening: true,
        total_questionnaires_completed: 4,
        total_questionnaires: 2,
        total_screenings_completed: 3,
        total_screenings: 1,
        assessment_completion_percentage: 75,
        criteria_met_percentage: 75,
        role_fit_score: 8.1,
        culture_fit_score: 8.2,
        submitted_at: TestData.now,
        completed_at: TestData.now,
        assessment_completed_at: new Date('2024-01-01'),
        seen_at: TestData.now,
        channel: ChannelType.APPLIED,
        skills: [],
        is_deleted: false,
        primary_contact_email: 'test@pulsifi.co',
        ...TestData.auditData,
    });

export const testJobApplicationCareerBuilder =
    Factory.Sync.makeFactory<JobApplicationCareer>({
        job_application_id: '00000000-0000-0000-0000-000000000001',
        organization: 'Pulsifi',
        role: 'Software Engineer',
        is_current: true,
        start_date: new Date('2021-01-01'),
        ...TestData.auditData,
    });

export const testJobApplicationActionHistory =
    Factory.Sync.makeFactory<JobApplicationActionHistory>({
        job_application_id: '00000000-0000-0000-0000-000000000001',
        action_type: ApplicationTimeline.APPLICATION_APPLIED,
        value: objectParser.toJSON({
            status: `${JobApplicationStatus.APPLIED}`,
        }),
        created_username: TestData.createdUsername,
        ...TestData.auditData,
    });

export const testJobApplicationQuestionnaire =
    Factory.Sync.makeFactory<JobApplicationQuestionnaire>({
        job_application_id: '00000000-0000-0000-0000-000000000001',
        questionnaire_framework: QuestionnaireFramework.PERSONALITY,
        questionnaire_id: 30,
        started_at: new Date('2024-01-01'),
        completed_at: new Date('2024-01-01'),
        attempts: 1,
        question_answer_raw: {} as JSON,
        result_raw: {} as JSON,
        ...TestData.auditData,
    });
