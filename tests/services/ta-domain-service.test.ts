import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import {
    ApplicationTimeline,
    ChannelType,
    ContactType,
    DEFAULT_CANDIDATE_USERNAME,
    JobApplicationStatus,
} from '@pulsifi/constants';
import {
    CandidateApplicationAssessmentStarted,
    CandidateApplicationAssessmentSubmitted,
    CandidateApplicationCompleted,
    CandidateApplicationWithdrawn,
    CandidateProfile,
    CreateJobDto,
    JobApplicationDto,
    JobApplicationQuestionnaireDto,
} from '@pulsifi/dtos';
import { generatorUtil } from '@pulsifi/fn';
import {
    Job,
    JobApplication,
    JobApplicationActionHistory,
    JobApplicationCareer,
    JobApplicationEducation,
    JobScreeningQuestion,
} from '@pulsifi/models';
import { JobApplicationService } from '@pulsifi/services';
import { mockClient } from 'aws-sdk-client-mock';
import { Readable } from 'stream';
import { DataSource } from 'typeorm';

import {
    candidateActivityPayload,
    candidateApplicationSubmittedPayload,
    candidateApplicationUpdatedCareerOnlyPayload,
    candidateApplicationUpdatedPayload,
    candidateAssessmentsPayload,
    candidateCareerPayload,
    candidateEducationPayload,
    candidateProfilePayload,
    candidateScreeningAnswerAttachmentPayload,
    candidateScreeningAnswerPayload,
    deprecatedCandidateScreeningAnswerAttachmentPayload,
    jobApplicationAttachmentPayload,
    jobApplicationCareer,
    jobApplicationDaxtraEmailContact,
    jobApplicationDaxtraMobile1Contact,
    jobApplicationDaxtraMobile2Contact,
    jobApplicationEducation,
    jobApplicationEmailContact,
    jobApplicationPhoneContact,
    jobApplicationQuestionnaire16,
    jobApplicationQuestionnaire30,
    jobApplicationResult,
    jobApplicationResume,
    jobApplicationScreeningAnswer,
    jobApplicationScreeningAnswerAttachment,
    minJobFieldsPayload,
} from '../fixtures';
import {
    candidateAssessment16,
    candidateAssessment30,
} from '../fixtures/candidate/assessment-30-data';
import sampleResume from '../samples/sample-resume.json';
import { getTestDataSourceAndAddData } from '../setup';
import { testData } from './fixtures/test-data';

const s3ClientMock = mockClient(S3Client);
const snsClientMock = mockClient(SNSClient);
const mockGetFitScoreRecipeById = jest.fn();
const mockGetPairwiseSimilarity = jest.fn();

describe('TADomainService', () => {
    let jobApplicationService: JobApplicationService;
    let dataSource: DataSource;

    beforeEach(async () => {
        await mockAwsClientResponse();
    });

    beforeAll(async () => {
        dataSource = await getTestDataSourceAndAddData(
            testData.entitiesToBeAdded,
        );
        jobApplicationService = new JobApplicationService(dataSource);
    });

    const mockAwsClientResponse = async () => {
        const stream = new Readable();
        stream.push(JSON.stringify(sampleResume));
        stream.push(null); // end of stream

        // alternatively: create Stream from file
        // const stream = createReadStream('sample-resume.json');

        // wrap the Stream with SDK mixin
        const sdkStream = sdkStreamMixin(stream);

        s3ClientMock.on(GetObjectCommand).resolves({ Body: sdkStream });
        s3ClientMock.on(GetObjectCommand).resolves({ Body: sdkStream });

        snsClientMock.on(PublishCommand).resolves({ MessageId: '123' });
        snsClientMock.on(PublishCommand).resolves({ MessageId: '123' });
    };

    mockGetFitScoreRecipeById.mockResolvedValue(testData.mockGetFitScoreRecipe);
    mockGetPairwiseSimilarity.mockResolvedValue(
        testData.mockGetPairwiseSimilarityHardSkill,
    );

    /** validate test */
    const getTestJobApplicationById = async (id: string) => {
        const jobApplication = await dataSource
            .createQueryBuilder()
            .select('ja')
            .from(JobApplication, 'ja')
            .leftJoinAndSelect('ja.action_histories', 'action_histories')
            .leftJoinAndSelect('ja.attachments', 'attachments')
            .leftJoinAndSelect('ja.careers', 'careers')
            .leftJoinAndSelect('ja.contacts', 'contacts')
            .leftJoinAndSelect('ja.educations', 'educations')
            .leftJoinAndSelect('ja.resumes', 'resumes')
            .leftJoinAndSelect('ja.scores', 'scores')
            .leftJoinAndSelect('ja.screening_answers', 'screening_answers')
            .leftJoinAndSelect('ja.questionnaires', 'questionnaires')
            .where('ja.id = :id', { id })
            .getOneOrFail();

        return jobApplication;
    };

    const getJobApplicationById = async (id: string) => {
        const jobApplication = await dataSource
            .createQueryBuilder()
            .select('ja')
            .from(JobApplication, 'ja')
            .where('ja.id = :id', { id })
            .getOneOrFail();

        return jobApplication;
    };

    const getJobApplicationActionHistoryById = async (
        jobApplicationId: string,
    ) => {
        const jobApplicationActionHistory = await dataSource
            .createQueryBuilder()
            .select('ja_history')
            .from(JobApplicationActionHistory, 'ja_history')
            .where('ja_history.job_application_id = :jobApplicationId', {
                jobApplicationId,
            })
            .getMany();

        return jobApplicationActionHistory;
    };

    it('should pass create job application with valid payload', async () => {
        /** setup */
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );
        const jobScreeningQuestionRepo =
            dataSource.getRepository(JobScreeningQuestion);
        await jobScreeningQuestionRepo.save([
            {
                job_id: job.id,
                alias: 'question1',
                order_no: 1,
                schema: {},
                question_hash_code: 111,
                created_by: 1,
                updated_by: 1,
            },
            {
                job_id: job.id,
                alias: 'question1',
                order_no: 2,
                schema: {},
                question_hash_code: 222,
                created_by: 1,
                updated_by: 1,
            },
        ]);

        /** end setup */

        const newJAId: string =
            await jobApplicationService.createJobApplication(0, {
                ...candidateApplicationSubmittedPayload,
                job_id: job.id,
                activities: [candidateActivityPayload],
                careers: [candidateCareerPayload],
                educations: [candidateEducationPayload],
                screening_answers: [
                    candidateScreeningAnswerPayload,
                    candidateScreeningAnswerAttachmentPayload,
                ],
                assessments: candidateAssessmentsPayload,
            });

        const newJobApplication = await getTestJobApplicationById(newJAId);

        const output = new JobApplicationDto(newJobApplication);

        expect(newJobApplication.channel).toEqual(ChannelType.APPLIED);

        expect(output).toEqual({
            ...jobApplicationResult,
            id: newJAId,
            job_id: job.id,
            ext_candidate_job_application_id:
                candidateApplicationSubmittedPayload.id,
            last_status_changed_at: expect.any(Date),
            assessment_completed_at: null,
            assessment_started_at: null,
            is_anonymous: false,
            ext_reference_id: null,
            source: null,
            submitted_at: null,
            completed_at: null,
            total_screenings: 1,
            total_screenings_completed: 1,
            primary_contact_email: 'tester@pulsifi.me',
            careers: [
                {
                    ...jobApplicationCareer,
                    job_application_id: output.id,
                    start_date: expect.any(Date),
                    end_date: expect.any(Date),
                    description: null,
                },
            ],
            educations: [
                {
                    ...jobApplicationEducation,
                    job_application_id: output.id,
                    start_date: expect.any(Date),
                    end_date: expect.any(Date),
                    grade_cgpa: 0,
                },
            ],
            resumes: [
                {
                    ...jobApplicationResume,
                    job_application_id: output.id,
                },
            ],
            screening_answers: expect.arrayContaining([
                {
                    ...jobApplicationScreeningAnswer,
                    // id: expect.any(Number),
                    job_application_id: output.id,
                    attachment_file_id: null,
                    question_hash_code: 111,
                },
                {
                    ...jobApplicationScreeningAnswerAttachment,
                    // id: expect.any(Number),
                    job_application_id: output.id,
                    tag: null,
                    question_hash_code: 222,
                },
            ]),
            contacts: expect.arrayContaining([
                {
                    ...jobApplicationEmailContact,
                    id: expect.any(Number),
                    job_application_id: output.id,
                },
                {
                    ...jobApplicationPhoneContact,
                    id: expect.any(Number),
                    job_application_id: output.id,
                },
                {
                    ...jobApplicationDaxtraEmailContact,
                    id: expect.any(Number),
                    is_primary: false,
                    job_application_id: output.id,
                },
                {
                    ...jobApplicationDaxtraMobile1Contact,
                    id: expect.any(Number),
                    is_primary: false,
                    job_application_id: output.id,
                },
                {
                    ...jobApplicationDaxtraMobile2Contact,
                    id: expect.any(Number),
                    is_primary: false,
                    job_application_id: output.id,
                },
            ]),
            action_histories: [
                {
                    id: 3,
                    action_type: ApplicationTimeline.APPLICATION_APPLIED,
                    created_username: DEFAULT_CANDIDATE_USERNAME,
                    job_application_id: output.id,
                    value: {
                        status: JobApplicationStatus.APPLIED,
                    },
                },
            ],
            questionnaires: [
                {
                    ...jobApplicationQuestionnaire30,
                    job_application_id: newJAId,
                    id: expect.any(Number),
                    started_at: expect.any(Date),
                    completed_at: expect.any(Date),
                },
            ],
            attachments: [
                {
                    ...jobApplicationAttachmentPayload,
                    job_application_id: newJAId,
                    id: expect.any(Number),
                },
            ],
            scores: [],
        });
    });

    it('should pass create job application with valid deprecated payload', async () => {
        /** setup */
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );
        /** end setup */

        const newJAId: string =
            await jobApplicationService.createJobApplication(0, {
                ...candidateApplicationSubmittedPayload,
                id: generatorUtil.uuid(),
                job_id: job.id,
                activities: [candidateActivityPayload],
                careers: [candidateCareerPayload],
                educations: [candidateEducationPayload],
                screening_answers: [
                    candidateScreeningAnswerPayload,
                    deprecatedCandidateScreeningAnswerAttachmentPayload,
                ],
                assessments: candidateAssessmentsPayload,
            });

        const newJobApplication = await getTestJobApplicationById(newJAId);

        const output = new JobApplicationDto(newJobApplication);
        expect(newJobApplication.channel).toEqual(ChannelType.APPLIED);

        expect(output).toEqual({
            ...jobApplicationResult,
            id: newJAId,
            job_id: job.id,
            ext_candidate_job_application_id: expect.any(String),
            last_status_changed_at: expect.any(Date),
            assessment_completed_at: null,
            assessment_started_at: null,
            is_anonymous: false,
            ext_reference_id: null,
            total_screenings: 1,
            total_screenings_completed: 1,
            source: null,
            submitted_at: null,
            completed_at: null,
            primary_contact_email: 'tester@pulsifi.me',
            careers: [
                {
                    ...jobApplicationCareer,
                    id: expect.any(Number),
                    job_application_id: output.id,
                    start_date: expect.any(Date),
                    end_date: expect.any(Date),
                    description: null,
                },
            ],
            educations: [
                {
                    ...jobApplicationEducation,
                    id: expect.any(Number),
                    job_application_id: output.id,
                    start_date: expect.any(Date),
                    end_date: expect.any(Date),
                    grade_cgpa: 0,
                },
            ],
            resumes: [
                {
                    ...jobApplicationResume,
                    id: expect.any(Number),
                    job_application_id: expect.any(String),
                },
            ],
            screening_answers: expect.arrayContaining([
                {
                    ...jobApplicationScreeningAnswer,
                    job_application_id: output.id,
                    attachment_file_id: null,
                    question_hash_code: 111,
                },
                {
                    question:
                        candidateScreeningAnswerAttachmentPayload.question,
                    answer: deprecatedCandidateScreeningAnswerAttachmentPayload.answer,
                    tag: null,
                    criteria_status:
                        candidateScreeningAnswerAttachmentPayload.criteria_status,
                    attachment_file_id: expect.any(Number),
                    order_no:
                        candidateScreeningAnswerAttachmentPayload.order_no,
                    job_screening_question_id:
                        candidateScreeningAnswerAttachmentPayload.job_screening_question_id,
                    job_application_id: output.id,
                    question_hash_code: 222,
                },
            ]),
            contacts: expect.arrayContaining([
                {
                    ...jobApplicationEmailContact,
                    id: expect.any(Number),
                    job_application_id: output.id,
                },
                {
                    ...jobApplicationPhoneContact,
                    id: expect.any(Number),
                    job_application_id: output.id,
                },
                {
                    ...jobApplicationDaxtraEmailContact,
                    id: expect.any(Number),
                    is_primary: false,
                    job_application_id: output.id,
                },
                {
                    ...jobApplicationDaxtraMobile1Contact,
                    id: expect.any(Number),
                    is_primary: false,
                    job_application_id: output.id,
                },
                {
                    ...jobApplicationDaxtraMobile2Contact,
                    id: expect.any(Number),
                    is_primary: false,
                    job_application_id: output.id,
                },
            ]),
            action_histories: [
                {
                    id: expect.any(Number),
                    action_type: ApplicationTimeline.APPLICATION_APPLIED,
                    created_username: DEFAULT_CANDIDATE_USERNAME,
                    job_application_id: output.id,
                    value: {
                        status: JobApplicationStatus.APPLIED,
                    },
                },
            ],
            questionnaires: [
                {
                    ...jobApplicationQuestionnaire30,
                    job_application_id: newJAId,
                    id: expect.any(Number),
                    started_at: expect.any(Date),
                    completed_at: expect.any(Date),
                },
            ],
            attachments: [
                {
                    ...jobApplicationAttachmentPayload,
                    job_application_id: newJAId,
                    id: expect.any(Number),
                },
            ],
            scores: [],
        });
    });

    it('should pass create job application with integration candidate valid payload', async () => {
        /** setup */
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );
        /** end setup */

        const newJAId: string =
            await jobApplicationService.createJobApplication(0, {
                ...candidateApplicationSubmittedPayload,
                id: generatorUtil.uuid(),
                ext_reference_id: '1234567890',
                job_id: job.id,
                activities: [candidateActivityPayload],
                careers: [candidateCareerPayload],
                educations: [candidateEducationPayload],
                screening_answers: [
                    candidateScreeningAnswerPayload,
                    candidateScreeningAnswerAttachmentPayload,
                ],
                assessments: candidateAssessmentsPayload,
            });

        const newJobApplication = await getTestJobApplicationById(newJAId);

        expect(newJobApplication.channel).toEqual(ChannelType.INTEGRATION);
        expect(newJobApplication.ext_reference_id).toEqual('1234567890');
    });

    it('should pass create job application with integration candidate valid deprecated payload', async () => {
        /** setup */
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );
        /** end setup */

        const newJAId: string =
            await jobApplicationService.createJobApplication(0, {
                ...candidateApplicationSubmittedPayload,
                id: generatorUtil.uuid(),
                ext_reference_id: '1234567890',
                job_id: job.id,
                activities: [candidateActivityPayload],
                careers: [candidateCareerPayload],
                educations: [candidateEducationPayload],
                screening_answers: [
                    candidateScreeningAnswerPayload,
                    deprecatedCandidateScreeningAnswerAttachmentPayload,
                ],
                assessments: candidateAssessmentsPayload,
            });

        const newJobApplication = await getTestJobApplicationById(newJAId);

        expect(newJobApplication.channel).toEqual(ChannelType.INTEGRATION);
        expect(newJobApplication.ext_reference_id).toEqual('1234567890');
    });

    it('should pass update job application that override primary contact which is in source stage with valid payload', async () => {
        /** setup */
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );
        /** end setup */
        const jobApplicationId = generatorUtil.uuid();

        const sourceApplication = {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            total_questionnaires: 0,
            total_questionnaires_completed: 0,
            resume_content_path: undefined,
        };

        const sourceJAId = await jobApplicationService.createJobApplication(
            0,
            sourceApplication,
        );

        // mark job application as sourced status
        await dataSource
            .createQueryBuilder()
            .update(JobApplication)
            .set({
                status: JobApplicationStatus.SOURCED,
            })
            .where('id = :id', { id: sourceJAId })
            .execute();

        const newApplication = {
            ...candidateApplicationSubmittedPayload,
            id: jobApplicationId,
            job_id: job.id,
            status: undefined,
            activities: [candidateActivityPayload],
            careers: [candidateCareerPayload],
            educations: [candidateEducationPayload],
            screening_answers: [
                candidateScreeningAnswerPayload,
                candidateScreeningAnswerAttachmentPayload,
            ],
            assessments: candidateAssessmentsPayload,
        };

        const newJAId: string =
            await jobApplicationService.createJobApplication(0, {
                ...newApplication,
                profile: {
                    ...newApplication.profile!,
                    identity_value: 'abc@gmail.com',
                },
            });
        const newJobApplication = await getTestJobApplicationById(newJAId);
        expect(newJobApplication.seen_at).toBeNull();
        const output = new JobApplicationDto(newJobApplication);
        expect(output.status).toEqual(JobApplicationStatus.APPLIED);
        expect(output.careers).toHaveLength(1);
        expect(output.educations).toHaveLength(1);
        expect(output.screening_answers).toHaveLength(2);
        expect(output.questionnaires).toHaveLength(1);
        expect(output.contacts).toHaveLength(6);
        expect(
            output.contacts!.find(
                (i) =>
                    i.is_primary === true &&
                    i.contact_type === ContactType.EMAIL,
            )!.value,
        ).toEqual('abc@gmail.com');
        expect(output.primary_contact_email).toEqual('abc@gmail.com');
    });

    it('should pass update job application which is in source stage with valid deprecated payload', async () => {
        /** setup */
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );
        /** end setup */
        const jobApplicationId = generatorUtil.uuid();

        const sourceApplication = {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            total_questionnaires: 0,
            total_questionnaires_completed: 0,
            resume_content_path: undefined,
        };

        const sourceJAId = await jobApplicationService.createJobApplication(
            0,
            sourceApplication,
        );

        // mark job application as sourced status
        await dataSource
            .createQueryBuilder()
            .update(JobApplication)
            .set({
                status: JobApplicationStatus.SOURCED,
            })
            .where('id = :id', { id: sourceJAId })
            .execute();

        const newJAId: string =
            await jobApplicationService.createJobApplication(0, {
                ...candidateApplicationSubmittedPayload,
                id: jobApplicationId,
                job_id: job.id,
                status: undefined,
                activities: [candidateActivityPayload],
                careers: [candidateCareerPayload],
                educations: [candidateEducationPayload],
                screening_answers: [
                    candidateScreeningAnswerPayload,
                    deprecatedCandidateScreeningAnswerAttachmentPayload,
                ],
                assessments: candidateAssessmentsPayload,
            });
        const newJobApplication = await getTestJobApplicationById(newJAId);
        expect(newJobApplication.seen_at).toBeNull();
        const output = new JobApplicationDto(newJobApplication);
        expect(output.status).toEqual(JobApplicationStatus.APPLIED);
        expect(output.careers).toHaveLength(1);
        expect(output.educations).toHaveLength(1);
        expect(output.screening_answers).toHaveLength(2);
        expect(output.questionnaires).toHaveLength(1);
    });

    it('should pass skip add contact in job application with anonymous payload', async () => {
        /** setup */
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );
        /** end setup */
        const jobApplicationId = generatorUtil.uuid();

        const newJAId = await jobApplicationService.createJobApplication(0, {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            status: JobApplicationStatus.SOURCED,
            total_questionnaires: 0,
            total_questionnaires_completed: 0,
            resume_content_path: undefined,
            is_anonymous: true,
            ext_reference_id: '123123123',
        });

        const newJobApplication = await getTestJobApplicationById(newJAId);
        expect(newJobApplication.seen_at).toBeNull();
        const output = new JobApplicationDto(newJobApplication);
        expect(output.is_anonymous).toBeTruthy();
        expect(output.ext_reference_id).toEqual('123123123');
        expect(output.contacts).toHaveLength(1);
        expect(
            output.contacts!.find((c) => c.contact_type === ContactType.MOBILE),
        ).not.toBeNull();
        expect(
            output.contacts!.find((c) => c.contact_type === ContactType.EMAIL),
        ).toBeUndefined();
    });

    it('should pass add contact and career in job application with update with resume and career payload', async () => {
        /** setup */
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );
        /** end setup */
        const jobApplicationId = generatorUtil.uuid();

        const sourceApplication = {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            total_questionnaires: 0,
            total_questionnaires_completed: 0,
            resume_content_path: undefined,
            careers: [candidateCareerPayload],
        };

        const sourceJAId = await jobApplicationService.createJobApplication(
            0,
            sourceApplication,
        );

        const sourceJobApplication = await getTestJobApplicationById(
            sourceJAId,
        );

        const uploadedResumeJobApplicationId =
            await jobApplicationService.updateJobApplication(0, {
                ...candidateApplicationUpdatedPayload,
                job_id: job.id,
                job_application_id:
                    sourceJobApplication.ext_candidate_job_application_id,
            });

        const updatedJobApplication = await getTestJobApplicationById(
            uploadedResumeJobApplicationId,
        );
        const output = new JobApplicationDto(updatedJobApplication);
        expect(output.resumes).toHaveLength(2);
        expect(output.contacts).toHaveLength(5);
        expect(output.careers).toHaveLength(1);
    });

    it('should pass add career only in job application with update with career payload', async () => {
        /** setup */
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );
        /** end setup */
        const jobApplicationId = generatorUtil.uuid();

        const sourceApplication = {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            total_questionnaires: 0,
            total_questionnaires_completed: 0,
            resume_content_path: undefined,
            screening_answers: [
                candidateScreeningAnswerPayload,
                candidateScreeningAnswerAttachmentPayload,
            ],
        };

        const sourceJAId = await jobApplicationService.createJobApplication(
            0,
            sourceApplication,
        );

        const sourceJobApplication = await getTestJobApplicationById(
            sourceJAId,
        );

        const uploadedResumeJobApplicationId =
            await jobApplicationService.updateJobApplication(0, {
                ...candidateApplicationUpdatedCareerOnlyPayload,
                job_id: job.id,
                job_application_id:
                    sourceJobApplication.ext_candidate_job_application_id,
            });

        const updatedJobApplication = await getTestJobApplicationById(
            uploadedResumeJobApplicationId,
        );
        const output = new JobApplicationDto(updatedJobApplication);

        expect(output.resumes).toHaveLength(1);
        expect(output.careers).toHaveLength(1);
        expect(output.screening_answers).toHaveLength(2);
    });

    it('should pass add screening only in job application with update with screening payload', async () => {
        /** setup */
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );
        /** end setup */
        const jobApplicationId = generatorUtil.uuid();

        const sourceApplication = {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            total_questionnaires: 0,
            total_questionnaires_completed: 0,
            resume_content_path: undefined,
        };

        const sourceJAId = await jobApplicationService.createJobApplication(
            0,
            sourceApplication,
        );

        const sourceJobApplication = await getTestJobApplicationById(
            sourceJAId,
        );

        const uploadedResumeJobApplicationId =
            await jobApplicationService.updateJobApplication(0, {
                ...candidateApplicationUpdatedCareerOnlyPayload,
                job_id: job.id,
                job_application_id:
                    sourceJobApplication.ext_candidate_job_application_id,
                careers: undefined,
                screening_answers: [
                    candidateScreeningAnswerPayload,
                    candidateScreeningAnswerAttachmentPayload,
                ],
            });

        const updatedJobApplication = await getTestJobApplicationById(
            uploadedResumeJobApplicationId,
        );
        const output = new JobApplicationDto(updatedJobApplication);

        expect(output.screening_answers).toHaveLength(2);
    });

    it('should pass skip mobile contact in job application with valid payload', async () => {
        /** setup */

        const hidePhoneNumberFormJob = <CreateJobDto>{
            ...minJobFieldsPayload,
            application_form: {
                resume: true,
                profile: {
                    full_name: true,
                    phone_number: false,
                    address: false,
                    nationality: false,
                    source: true,
                },
                work_experience: true,
                education: true,
                additional: true,
                review: true,
            },
        };

        const job: Job = await jobApplicationService.createJob(
            hidePhoneNumberFormJob,
        );
        /** end setup */
        const jobApplicationId = generatorUtil.uuid();

        const hideSensitiveFieldsProfile = <CandidateProfile>{
            ...candidateProfilePayload,
            phone_code: undefined,
            phone_number: undefined,
            nationality: undefined,
            place_result: undefined,
            place_formatted_address: undefined,
        };

        const sourceApplication = {
            ...candidateApplicationSubmittedPayload,
            profile: hideSensitiveFieldsProfile,
            job_id: job.id,
            id: jobApplicationId,
            total_questionnaires: 0,
            total_questionnaires_completed: 0,
        };

        const newJAId = await jobApplicationService.createJobApplication(
            0,
            sourceApplication,
        );

        const newJobApplication = await getTestJobApplicationById(newJAId);
        const output = new JobApplicationDto(newJobApplication);
        expect(newJobApplication.nationality).toBeNull();
        expect(newJobApplication.place_result).toBeNull();
        expect(newJobApplication.place_formatted_address).toBeNull();
        expect(output.contacts).toHaveLength(2);
        expect(
            output.contacts!.find((c) => c.contact_type === ContactType.EMAIL),
        ).not.toBeNull();
        expect(
            output.contacts!.find((c) => c.contact_type === ContactType.MOBILE),
        ).toBeUndefined();
        expect(output.primary_contact_email).toEqual('tester@pulsifi.me');
    });

    it('should fail create job application with invalid job_id', async () => {
        expect.hasAssertions();

        try {
            await jobApplicationService.createJobApplication(0, {
                ...candidateApplicationSubmittedPayload,
                job_id: 'aaaa',
            });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toEqual('Invalid job id');
        }
    });

    it('should not duplicate job application with exist ext candidate job app id but not in source status', async () => {
        expect.hasAssertions();

        // Arrange
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );
        const jobApplicationId = generatorUtil.uuid();
        const sourceApplication = {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            total_questionnaires: 0,
            total_questionnaires_completed: 0,
            resume_content_path: undefined,
        };

        // Act
        await jobApplicationService.createJobApplication(0, sourceApplication);
        await jobApplicationService.createJobApplication(0, sourceApplication);

        // Assert
        const taJobApps = await dataSource.getRepository(JobApplication).find({
            where: { ext_candidate_job_application_id: jobApplicationId },
            select: ['id'],
        });

        expect(taJobApps.length).toEqual(1);
    });

    it('should pass update job application with valid application completed payload', async () => {
        // Arrange
        const updatePayload: CandidateApplicationCompleted = {
            id: testData.jobApplication5.ext_candidate_job_application_id!,
            company_id: testData.jobApplication5.company_id,
            job_id: testData.jobApplication5.job_id,
            status: testData.jobApplication5.status,
            is_questionnaires_required:
                testData.jobApplication5.is_questionnaires_required,
            total_questionnaires: testData.jobApplication5.total_questionnaires,
            total_questionnaires_completed:
                testData.jobApplication5.total_questionnaires_completed,
            submitted_at: testData.jobApplication5.submitted_at,
            completed_at: new Date('2024-04-09T05:20:19.000Z'),
            profile: undefined,
            is_video_required: false,
            is_anonymous: false,
        };

        // Act
        const updatedJAId: string =
            await jobApplicationService.completedJobApplication(
                1,
                updatePayload,
            );

        // Assert
        const updatedJobApplication = await getTestJobApplicationById(
            updatedJAId,
        );
        const actual = new JobApplicationDto(updatedJobApplication);

        expect(actual).toMatchSnapshot({
            last_status_changed_at: expect.any(Date),
            submitted_at: expect.any(Date),
        });
    });

    it('should pass update job application with valid application without assessment', async () => {
        // Arrange
        const updatePayload: CandidateApplicationCompleted = {
            id: testData.jobApplication6.ext_candidate_job_application_id!,
            company_id: testData.jobApplication6.company_id,
            job_id: testData.jobApplication6.job_id,
            status: testData.jobApplication6.status,
            is_questionnaires_required:
                testData.jobApplication6.is_questionnaires_required,
            total_questionnaires: testData.jobApplication6.total_questionnaires,
            total_questionnaires_completed:
                testData.jobApplication6.total_questionnaires_completed,
            submitted_at: testData.jobApplication6.submitted_at,
            completed_at: new Date('2024-04-09T05:20:19.000Z'),
            profile: undefined,
            is_video_required: false,
            is_anonymous: false,
        };

        // Act
        const updatedJAId: string =
            await jobApplicationService.completedJobApplication(
                1,
                updatePayload,
            );

        // Assert
        const updatedJobApplication = await getTestJobApplicationById(
            updatedJAId,
        );
        const actual = new JobApplicationDto(updatedJobApplication);

        expect(actual).toMatchSnapshot({
            last_status_changed_at: expect.any(Date),
            submitted_at: expect.any(Date),
        });
    });

    it('should pass update job application assessment with valid personality assessment submitted payload', async () => {
        /** setup */
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );

        const jobApplicationId = generatorUtil.uuid();
        const newJAId = await jobApplicationService.createJobApplication(0, {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            profile: {
                ...candidateProfilePayload,
            },
            // assessments: [],
        });
        /** end setup */

        const updatedPayload: CandidateApplicationAssessmentSubmitted = {
            ...candidateAssessment30,
            job_application_id: jobApplicationId,
            // completed_at: new Date(),
            company_id: candidateApplicationSubmittedPayload.company_id,
        };
        const output: JobApplicationQuestionnaireDto =
            await jobApplicationService.updateJobApplicationQuestionnaire(
                0,
                updatedPayload,
            );

        expect(output).toEqual({
            ...jobApplicationQuestionnaire30,
            job_application_id: newJAId,
            id: expect.any(Number),
            started_at: expect.any(Date),
            completed_at: expect.any(Date),
        });

        const checkJobApplication = await getJobApplicationById(newJAId);
        expect(checkJobApplication.assessment_completion_percentage).toEqual(
            16.6666667,
        );
        expect(checkJobApplication.total_questionnaires_completed).toEqual(1);
    });

    it('should pass update job application video assessment with valid payload', async () => {
        /** setup */
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );

        const jobApplicationId = generatorUtil.uuid();
        const newJAId = await jobApplicationService.createJobApplication(0, {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            profile: {
                ...candidateProfilePayload,
            },
            // assessments: [],
        });
        /** end setup */

        const updatedPayload: CandidateApplicationAssessmentSubmitted = {
            ...candidateAssessment16,
            job_application_id: jobApplicationId,
            // completed_at: new Date(),
            company_id: candidateApplicationSubmittedPayload.company_id,
        };
        const output: JobApplicationQuestionnaireDto =
            await jobApplicationService.updateJobApplicationQuestionnaire(
                0,
                updatedPayload,
            );

        expect(output).toEqual({
            ...jobApplicationQuestionnaire16,
            job_application_id: newJAId,
            id: expect.any(Number),
            started_at: expect.any(Date),
            completed_at: expect.any(Date),
        });

        const checkJobApplication = await getTestJobApplicationById(newJAId);
        const jobAppOutput = new JobApplicationDto(checkJobApplication);

        expect(checkJobApplication.assessment_completion_percentage).toEqual(
            16.6666667,
        );
        expect(checkJobApplication.total_questionnaires_completed).toEqual(1);

        expect(jobAppOutput.action_histories).toEqual(
            expect.arrayContaining([
                {
                    id: expect.any(Number),
                    action_type: ApplicationTimeline.APPLICATION_APPLIED,
                    created_username: DEFAULT_CANDIDATE_USERNAME,
                    job_application_id: jobAppOutput.id,
                    value: {
                        status: JobApplicationStatus.APPLIED,
                    },
                },
                {
                    id: expect.any(Number),
                    action_type:
                        ApplicationTimeline.APPLICATION_VIDEO_INTERVIEW_COMPLETED,
                    created_username: DEFAULT_CANDIDATE_USERNAME,
                    job_application_id: jobAppOutput.id,
                    value: null,
                },
            ]),
        );
    });

    it('should pass for withdrawn job application with valid CandidateApplicationWithdrawn payload', async () => {
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );

        const jobApplicationId = generatorUtil.uuid();
        await jobApplicationService.createJobApplication(0, {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            profile: {
                ...candidateProfilePayload,
            },
        });

        const withdrawnPayload: CandidateApplicationWithdrawn = {
            job_id: job.id,
            id: jobApplicationId,
            company_id: candidateApplicationSubmittedPayload.company_id,
            job_title: job.title,
            status: JobApplicationStatus.WITHDRAWN,
            withdrawn_reason: 'no_interested',
            withdrawn_at: new Date(),
        };
        const updatedJobApplicationId =
            await jobApplicationService.withdrawnJobApplication(
                0,
                withdrawnPayload,
            );

        const newJobApplication = await getTestJobApplicationById(
            updatedJobApplicationId,
        );

        expect(newJobApplication.status).toEqual(
            JobApplicationStatus.WITHDRAWN,
        );
        expect(newJobApplication.drop_out_reason).toEqual(
            withdrawnPayload.withdrawn_reason,
        );
        expect(newJobApplication.drop_out_at).toEqual(
            withdrawnPayload.withdrawn_at,
        );
        expect(
            newJobApplication.action_histories!.find(
                (i) =>
                    i.action_type ===
                    ApplicationTimeline.APPLICATION_CANDIDATE_WITHDRAWN,
            ),
        ).not.toBeNull();
    });

    it('should pass for mark job application assessment started with valid candidateApplicationSubmittedPayload with at least 1 completed questionnaires', async () => {
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );

        const jobApplicationId = generatorUtil.uuid();
        const savedJobApplicationId =
            await jobApplicationService.createJobApplication(0, {
                ...candidateApplicationSubmittedPayload,
                job_id: job.id,
                id: jobApplicationId,
                profile: {
                    ...candidateProfilePayload,
                },
                total_questionnaires_completed: 1,
                assessments: [
                    {
                        ...candidateAssessment30,
                    },
                ],
            });

        const newJobApplication = await getTestJobApplicationById(
            savedJobApplicationId,
        );

        expect(newJobApplication.assessment_started_at).toEqual(
            newJobApplication.submitted_at,
        );
    });

    it('should pass for mark job application assessment started with valid Candidate Assessment Started payload', async () => {
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );

        const jobApplicationId = generatorUtil.uuid();
        await jobApplicationService.createJobApplication(0, {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            profile: {
                ...candidateProfilePayload,
            },
        });

        const candidateAssessmentStartedPayload: CandidateApplicationAssessmentStarted =
            {
                job_application_id: jobApplicationId,
                company_id: candidateApplicationSubmittedPayload.company_id,
                ...candidateAssessment30,
            };

        const updatedJobApplicationId =
            await jobApplicationService.markJobApplicationAssessmentStarted(
                0,
                candidateAssessmentStartedPayload,
            );

        const newJobApplication = await getTestJobApplicationById(
            updatedJobApplicationId,
        );

        expect(newJobApplication.assessment_started_at).not.toBeNull();
    });

    it('should pass for skip mark job application assessment started with valid Candidate Video Assessment Started payload', async () => {
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );

        const jobApplicationId = generatorUtil.uuid();
        await jobApplicationService.createJobApplication(0, {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            profile: {
                ...candidateProfilePayload,
            },
        });

        const candidateAssessmentStartedPayload: CandidateApplicationAssessmentStarted =
            {
                job_application_id: jobApplicationId,
                company_id: candidateApplicationSubmittedPayload.company_id,
                ...candidateAssessment16,
            };

        const updatedJobApplicationId =
            await jobApplicationService.markJobApplicationAssessmentStarted(
                0,
                candidateAssessmentStartedPayload,
            );

        const newJobApplication = await getTestJobApplicationById(
            updatedJobApplicationId,
        );

        expect(newJobApplication.assessment_started_at).toBeNull();
    });

    it('should pass create job application with valid payload and career and education should have new id', async () => {
        // Arrange
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );

        // Act
        const newJAId: string =
            await jobApplicationService.createJobApplication(0, {
                ...candidateApplicationSubmittedPayload,
                id: generatorUtil.uuid(),
                job_id: job.id,
                activities: [candidateActivityPayload],
                careers: [{ ...candidateCareerPayload, id: 555 }],
                educations: [{ ...candidateEducationPayload, id: 666 }],
                screening_answers: [],
                assessments: candidateAssessmentsPayload,
            });

        // Assert
        const careers = await dataSource
            .getRepository(JobApplicationCareer)
            .findOneBy({ job_application_id: newJAId });

        const education = await dataSource
            .getRepository(JobApplicationEducation)
            .findOneBy({ job_application_id: newJAId });

        expect(careers).toMatchSnapshot({
            job_application_id: expect.anything(),
            end_date: expect.any(Date),
            start_date: expect.any(Date),
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
        });

        expect(education).toMatchSnapshot({
            job_application_id: expect.anything(),
            end_date: expect.any(Date),
            start_date: expect.any(Date),
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
        });
    });

    it('should pass updateJobApplicationAfterImportedAsEmployee', async () => {
        // Arrange
        const employeeId = generatorUtil.uuid();
        const displayName = 'Tester Lee';
        const job: Job = await jobApplicationService.createJob(
            minJobFieldsPayload,
        );

        const jobApplicationId = generatorUtil.uuid();
        const newJAId = await jobApplicationService.createJobApplication(0, {
            ...candidateApplicationSubmittedPayload,
            job_id: job.id,
            id: jobApplicationId,
            profile: {
                ...candidateProfilePayload,
            },
        });

        // Act
        await jobApplicationService.updateJobApplicationAfterImportedAsEmployee(
            0,
            {
                employee_id: employeeId,
                user_display_name: displayName,
                job_application_id: newJAId,
            },
        );

        // Assert
        const jobApplication = await getJobApplicationById(newJAId);
        expect(jobApplication.ext_employee_id).toEqual(employeeId);

        const jobApplicationActionHistory =
            await getJobApplicationActionHistoryById(newJAId);
        expect(jobApplicationActionHistory).toContainEqual({
            created_by: 0,
            updated_by: 0,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            id: expect.any(Number),
            job_application_id: newJAId,
            action_type: ApplicationTimeline.APPLICATION_IMPORTED_AS_EMPLOYEE,
            value: null,
            created_username: displayName,
        });
    });
});
