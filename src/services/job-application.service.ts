import {
    ApplicationTimeline,
    AssessmentInviteOption,
    ChannelType,
    ContactType,
    DEFAULT_CANDIDATE_USERNAME,
    JobApplicationStatus,
    JobStatus,
    LambdaErrorMsg,
    QuestionnaireFramework,
    TalentAcquisitionEventType,
} from '@pulsifi/constants';
import {
    CandidateApplicationAssessmentStarted,
    CandidateApplicationAssessmentSubmitted,
    CandidateApplicationCompleted,
    CandidateApplicationSubmitted,
    CandidateApplicationUpdated,
    CandidateApplicationWithdrawn,
    CandidateScreeningAttachmentAnswer,
    CreateJobDto,
    EmployeeImportedEvent,
    JobApplicationQuestionnaireDto,
    TalentAcquisitionApplicationSubmitted,
    TalentAcquisitionApplicationUpdated,
    TalentAcquisitionAssessmentSubmitted,
} from '@pulsifi/dtos';
import { generatorUtil, logger, objectParser } from '@pulsifi/fn';
import { IEventModel } from '@pulsifi/interfaces';
import { jobApplicationMapper } from '@pulsifi/mappers';
import {
    ApplicationForm,
    Job,
    JobApplication,
    JobApplicationActionHistory,
    JobApplicationAttachment,
    JobApplicationCareer,
    JobApplicationContact,
    JobApplicationEducation,
    JobApplicationQuestionnaire,
    JobApplicationResume,
    JobApplicationScreeningAnswer,
    JobQuestionnaire,
    ProfileForm,
} from '@pulsifi/models';
import {
    getDateWithMillisecondsOffset,
    getFilename,
    JobApplicationQueryBuilder,
    JobQueryBuilder,
    ScreeningUtils,
} from '@pulsifi/shared';
import { isEmpty, isNil } from 'lodash';
import { DataSource } from 'typeorm';

import { PublisherService } from './publisher.service';

export class JobApplicationService {
    private readonly publisherService: PublisherService =
        new PublisherService();

    constructor(private readonly dataSource: DataSource) {}

    async createJob(createJobDto: CreateJobDto): Promise<Job> {
        const payload: Job = {
            ...createJobDto,
            company_id: createJobDto.company_id ?? 1,
            id: generatorUtil.uuid(),
            place_result: undefined,
            skills: undefined,
            application_form:
                createJobDto.application_form ??
                JSON.parse(
                    JSON.stringify({
                        resume: true,
                        profile: true,
                        work_experience: true,
                        education: true,
                        activity: true,
                        additional: true,
                        review: true,
                    }),
                ),
            assessment_invite_option: AssessmentInviteOption.ALL,
            status: JobStatus.DRAFT,
            role_fit_recipe_id: createJobDto.role_fit_recipe_id,
            video_invite_option: 'all',
            created_by: 0,
            updated_by: 0,
        };
        const job = await this.dataSource.getRepository(Job).save(payload);

        return job;
    }

    async updateJobApplication(
        createdBy: number,
        payload: CandidateApplicationUpdated,
    ): Promise<string> {
        const jobBuilder = new JobQueryBuilder(
            this.dataSource.getRepository(Job),
        )
            .relateQuestionnaires()
            .whereJobIs(payload.job_id)
            .build();
        const job = await jobBuilder.getOne();
        if (!job) {
            throw new Error(LambdaErrorMsg.INVALID_JOB);
        }

        if (!payload.job_application_id) {
            throw new Error(LambdaErrorMsg.INVALID_JOB_APPLICATION);
        }

        const jobApplicationBuilder = new JobApplicationQueryBuilder(
            this.dataSource.getRepository(JobApplication),
        )
            .relateContacts()
            .relateResumes()
            .relateCareers()
            .whereCandidateApplicationIs(payload.job_application_id)
            .build();

        const jobApplication = await jobApplicationBuilder.getOne();
        if (!jobApplication) {
            throw new Error(LambdaErrorMsg.INVALID_JOB_APPLICATION);
        }

        const existingResumes = jobApplication.resumes || [];
        const existingContacts = jobApplication.contacts || [];

        let screeningAnswers: JobApplicationScreeningAnswer[] = [];
        let attachments: JobApplicationAttachment[] = [];
        if (payload.screening_answers?.length) {
            [screeningAnswers, attachments] =
                await jobApplicationMapper.screeningAnswerMapper(
                    this.dataSource,
                    createdBy,
                    jobApplication.id,
                    payload.company_id,
                    payload.screening_answers,
                );
        }
        const [
            criteriaMetPercentage,
            hasPassScreening,
            totalScreenings,
            totalScreeningsPass,
        ] = ScreeningUtils.calculateCriteriaSummary(screeningAnswers);

        const { resume, resumeContacts } =
            await jobApplicationMapper.jobApplicationResumeMapper(
                createdBy,
                jobApplication.id,
                payload.resume_file_path,
                payload.resume_content_path,
            );

        const savedContacts = jobApplicationMapper.resumeContactMapper(
            resumeContacts,
            existingContacts,
        );

        const primaryResume = existingResumes.find((i) => i.is_primary);
        if (primaryResume) {
            primaryResume.is_primary = false;
        }

        /** career */
        let careers: JobApplicationCareer[] = jobApplication.careers || [];
        if (!isEmpty(payload.careers)) {
            careers = jobApplicationMapper.careerMapper(
                createdBy,
                jobApplication.id,
                payload.careers!,
            );
        }

        const createdDate = new Date();
        const appliedActionHistory: JobApplicationActionHistory = {
            job_application_id: jobApplication.id,
            action_type: ApplicationTimeline.APPLICATION_RESUME_UPLOADED,
            created_username: DEFAULT_CANDIDATE_USERNAME,
            created_by: createdBy,
            updated_by: createdBy,
            created_at: createdDate,
            updated_at: createdDate,
        };

        await this.dataSource.transaction(async (manager) => {
            if (primaryResume) {
                await manager.save(JobApplicationResume, primaryResume);
            }
            if (resume) {
                await manager.save(JobApplicationResume, resume);
                await manager.save(JobApplicationContact, savedContacts);
                await manager.save(
                    JobApplicationActionHistory,
                    appliedActionHistory,
                );
            }

            if (!isEmpty(payload.careers)) {
                if (!isEmpty(jobApplication.careers)) {
                    await manager.delete(
                        JobApplicationCareer,
                        jobApplication.careers!.map((i) => i.id),
                    );
                }

                await manager.insert(JobApplicationCareer, careers);
            }

            const tmpNewAttachments: JobApplicationAttachment[] = [];
            if (!isEmpty(attachments)) {
                for (const attachment of attachments) {
                    const newAttachment = await manager.save(
                        JobApplicationAttachment,
                        attachment,
                    );
                    if (!tmpNewAttachments.includes(newAttachment)) {
                        tmpNewAttachments.push(newAttachment);
                    }
                }
            }

            if (!isEmpty(screeningAnswers)) {
                const parsedScreeningAnswers =
                    await this.assignAttachmentToScreeningAnswer(
                        tmpNewAttachments,
                        screeningAnswers,
                    );
                await manager.save(
                    JobApplicationScreeningAnswer,
                    parsedScreeningAnswers,
                );
                await manager.update(
                    JobApplication,
                    { id: jobApplication.id },
                    {
                        has_passed_screening: hasPassScreening,
                        criteria_met_percentage: criteriaMetPercentage,
                        total_screenings_completed: totalScreeningsPass,
                        total_screenings: totalScreenings,
                        updated_by: createdBy,
                    },
                );
            }
        });

        jobApplication.job = job;
        const data = new TalentAcquisitionApplicationUpdated(
            jobApplication,
            resume,
            careers,
        );

        const message: IEventModel<TalentAcquisitionApplicationUpdated> = {
            event_type:
                TalentAcquisitionEventType.TALENT_ACQUISITION_APPLICATION_UPDATED,
            event_id: jobApplication.id,
            company_id: payload.company_id,
            user_account_id: createdBy,
            data,
        };
        await this.publisherService.sendMessage(message);

        return jobApplication.id;
    }

    private async jobApplicationMapper(
        createdBy: number,
        jobApplicationForm: ApplicationForm,
        jobApplicationId: string,
        payload: CandidateApplicationSubmitted,
        sourceJobApplication?: JobApplication | null,
    ): Promise<
        [
            JobApplication,
            JobApplicationAttachment[],
            JobApplicationCareer[],
            JobApplicationContact[],
            JobApplicationEducation[],
            JobApplicationQuestionnaire[],
            JobApplicationResume[],
            JobApplicationScreeningAnswer[],
        ]
    > {
        /** screening_answers */
        let screeningAnswers: JobApplicationScreeningAnswer[] = [];
        let attachments: JobApplicationAttachment[] = [];
        if (payload.screening_answers?.length) {
            [screeningAnswers, attachments] =
                await jobApplicationMapper.screeningAnswerMapper(
                    this.dataSource,
                    createdBy,
                    jobApplicationId,
                    payload.company_id,
                    payload.screening_answers,
                );
        }

        /** questionnaires */
        let questionnaires: JobApplicationQuestionnaire[] = [];
        if (payload.assessments?.length) {
            questionnaires = jobApplicationMapper.questionnaireMapper(
                createdBy,
                jobApplicationId,
                payload.assessments,
            );
        }

        const [
            criteriaMetPercentage,
            hasPassScreening,
            totalScreenings,
            totalScreeningsPass,
        ] = ScreeningUtils.calculateCriteriaSummary(screeningAnswers);
        const assessmentCompletedPercentage =
            ScreeningUtils.calculateAssessmentCompletionPercentage(
                questionnaires,
                payload.total_questionnaires,
            );

        let jobApplicationItem: JobApplication;
        if (sourceJobApplication) {
            jobApplicationItem = <JobApplication>{
                id: jobApplicationId,
                job_id: sourceJobApplication.job_id,
                company_id: sourceJobApplication.company_id,
                first_name: payload.profile!.first_name,
                last_name: payload.profile?.last_name,
                nationality: payload.profile?.nationality,
                source: payload.profile?.source,
                skills: payload.profile?.skills ?? null,
                professional_summary:
                    payload.profile?.professional_summary ?? null,
                ext_reference_id: payload.ext_reference_id,
                is_anonymous: payload.is_anonymous,
                user_account_id: payload.profile?.user_account_id || 0,
                place_formatted_address:
                    payload.profile?.place_formatted_address,
                place_result: payload.profile?.place_result
                    ? objectParser.toJSON(payload.profile.place_result)
                    : undefined,

                status: JobApplicationStatus.APPLIED,
                last_status_changed_at: new Date(),
                submitted_at: payload.submitted_at,
                is_questionnaires_required:
                    payload.is_questionnaires_required || false,
                total_questionnaires_completed:
                    payload.total_questionnaires_completed || 0,
                total_questionnaires: payload.total_questionnaires || 0,
                has_passed_screening: hasPassScreening,
                criteria_met_percentage: criteriaMetPercentage,
                total_screenings_completed: totalScreeningsPass,
                total_screenings: totalScreenings,
                assessment_completion_percentage: assessmentCompletedPercentage,
                is_video_required: payload.is_video_required,
                created_by: createdBy,
                updated_by: createdBy,
                seen_at: undefined,
            };
        } else {
            jobApplicationItem = <JobApplication>{
                id: jobApplicationId,
                ext_candidate_job_application_id: payload.id,
                company_id: payload.company_id,
                job_id: payload.job_id,
                first_name: payload.profile!.first_name,
                last_name: payload.profile?.last_name,
                nationality: payload.profile?.nationality,
                source: payload.profile?.source,
                skills: payload.profile?.skills ?? null,
                professional_summary:
                    payload.profile?.professional_summary ?? null,
                ext_reference_id: payload.ext_reference_id,
                is_anonymous: payload.is_anonymous,
                channel: payload.ext_reference_id
                    ? ChannelType.INTEGRATION
                    : ChannelType.APPLIED,
                user_account_id: payload.profile?.user_account_id || 0,
                place_formatted_address:
                    payload.profile?.place_formatted_address,
                place_result: payload.profile?.place_result
                    ? objectParser.toJSON(payload.profile.place_result)
                    : null,
                status: JobApplicationStatus.APPLIED,
                last_status_changed_at: payload.submitted_at,
                submitted_at: payload.submitted_at,
                is_questionnaires_required:
                    payload.is_questionnaires_required || false,
                total_questionnaires_completed:
                    payload.total_questionnaires_completed || 0,
                total_questionnaires: payload.total_questionnaires || 0,
                has_passed_screening: hasPassScreening,
                criteria_met_percentage: criteriaMetPercentage,
                total_screenings_completed: totalScreeningsPass,
                total_screenings: totalScreenings,
                assessment_completion_percentage: assessmentCompletedPercentage,
                is_video_required: payload.is_video_required,
                created_by: createdBy,
                updated_by: createdBy,
                is_deleted: false,
            };
        }

        const contacts: JobApplicationContact[] =
            sourceJobApplication?.contacts || [];
        const newContacts: JobApplicationContact[] =
            jobApplicationMapper.contactMapper(
                createdBy,
                jobApplicationId,
                true,
                payload.is_anonymous,
                payload.profile!,
            );
        if (!isEmpty(newContacts)) {
            newContacts.forEach((contact: JobApplicationContact) => {
                if (
                    !contacts.some(
                        (i) =>
                            i.value === contact.value &&
                            i.contact_type == contact.contact_type,
                    )
                ) {
                    //when try saved new contact as primary, mark existing primary contact type as false if found
                    const primaryContactType = contacts.find(
                        (i) =>
                            i.is_primary === true &&
                            i.contact_type === contact.contact_type,
                    );
                    if (primaryContactType) {
                        primaryContactType.is_primary = false;
                    }
                    contacts.push(contact);
                }
            });
        }
        const primaryContactEmail = contacts.find(
            (i) => i.is_primary && i.contact_type === ContactType.EMAIL,
        );
        if (primaryContactEmail) {
            jobApplicationItem.primary_contact_email =
                primaryContactEmail.value;
        }

        /** career */
        let careers: JobApplicationCareer[] = [];
        if (!isEmpty(payload.careers)) {
            careers = jobApplicationMapper.careerMapper(
                createdBy,
                jobApplicationId,
                payload.careers!,
            );
        }

        /** educations */
        let educations: JobApplicationEducation[] = [];
        if (!isEmpty(payload.educations)) {
            educations = jobApplicationMapper.educationMapper(
                createdBy,
                jobApplicationId,
                payload.educations!,
            );
        }

        /** resumes */
        let resumes: JobApplicationResume[] = [];
        if (payload.resume_file_path?.trim().length) {
            resumes = jobApplicationMapper.resumeMapper(
                createdBy,
                jobApplicationId,
                payload.resume_file_path,
                payload.resume_original_file_path!,
                payload.resume_content_path!,
            );
        }

        /** resume content_path */
        if (payload.resume_content_path?.trim().length) {
            const ignoreContactTypes = [];
            const profileForm = jobApplicationForm?.profile as ProfileForm;
            if (profileForm?.phone_number === false) {
                ignoreContactTypes.push(ContactType.MOBILE);
            }
            const otherContacts: JobApplicationContact[] =
                await jobApplicationMapper.resumeContentMapper(
                    createdBy,
                    jobApplicationId,
                    payload.resume_content_path,
                    ignoreContactTypes,
                );

            if (otherContacts?.length) {
                otherContacts.forEach((contact: JobApplicationContact) => {
                    if (
                        !contacts.some(
                            (i) =>
                                i.value === contact.value &&
                                i.contact_type == contact.contact_type,
                        )
                    ) {
                        contacts.push(contact);
                    }
                });
            }

            return [
                jobApplicationItem,
                attachments,
                careers,
                contacts,
                educations,
                questionnaires,
                resumes,
                screeningAnswers,
            ];
        }

        return [
            jobApplicationItem,
            attachments,
            careers,
            contacts,
            educations,
            questionnaires,
            resumes,
            screeningAnswers,
        ];
    }

    /** Transactional version */
    async createJobApplication(
        createdBy: number,
        payload: CandidateApplicationSubmitted,
    ): Promise<string> {
        const jobBuilder = new JobQueryBuilder(
            this.dataSource.getRepository(Job),
        )
            .relateQuestionnaires()
            .whereJobIs(payload.job_id)
            .build();
        const job = await jobBuilder.getOne();
        if (!job) {
            throw new Error(LambdaErrorMsg.INVALID_JOB);
        }
        const jobApplicationBuilder = new JobApplicationQueryBuilder(
            this.dataSource.getRepository(JobApplication),
        )
            .relateContacts()
            .whereCandidateApplicationIs(payload.id)
            .build();
        const sourceJobApplication = await jobApplicationBuilder.getOne();

        if (
            sourceJobApplication &&
            sourceJobApplication.status !== JobApplicationStatus.SOURCED
        ) {
            await this.retrySendSubmitJobApp(sourceJobApplication);
            logger.info(LambdaErrorMsg.JOB_APPLICATION_EXIST, {
                jobApplicationId: sourceJobApplication.id,
            });
            return sourceJobApplication.id;
        }

        const newJobApplicationId = sourceJobApplication
            ? sourceJobApplication.id
            : generatorUtil.uuid();
        let newJobApplication: JobApplication | undefined;
        let attachments: JobApplicationAttachment[] = [];
        let careers: JobApplicationCareer[] = [];
        let contacts: JobApplicationContact[] = [];
        let educations: JobApplicationEducation[] = [];
        let questionnaires: JobApplicationQuestionnaire[] = [];
        let resumes: JobApplicationResume[] = [];
        let screeningAnswers: JobApplicationScreeningAnswer[] = [];
        [
            // eslint-disable-next-line prefer-const
            newJobApplication,
            attachments,
            careers,
            contacts,
            educations,
            questionnaires,
            resumes,
            screeningAnswers,
        ] = await this.jobApplicationMapper(
            createdBy,
            job.application_form,
            newJobApplicationId,
            payload,
            sourceJobApplication,
        );

        const assessmentCompletedAt = this.populateAssessmentCompletedAt(
            job.questionnaires!,
            questionnaires,
            newJobApplication.submitted_at!,
        );
        newJobApplication.assessment_completed_at = assessmentCompletedAt;

        // when candidate apply 2nd job with any completed assessment
        newJobApplication.assessment_started_at =
            newJobApplication.total_questionnaires_completed > 0
                ? newJobApplication.submitted_at
                : undefined;

        /** action_histories */
        const actionHistories: JobApplicationActionHistory[] = [];
        const createdDate = new Date();
        const appliedActionHistory: JobApplicationActionHistory = {
            job_application_id: newJobApplication.id,
            action_type: ApplicationTimeline.APPLICATION_APPLIED,
            value: objectParser.toJSON({
                status: JobApplicationStatus.APPLIED,
            }),
            created_username: DEFAULT_CANDIDATE_USERNAME,
            created_by: createdBy,
            updated_by: createdBy,
            created_at: createdDate,
            updated_at: createdDate,
        };
        actionHistories.push(appliedActionHistory);

        if (assessmentCompletedAt) {
            const createdDate = getDateWithMillisecondsOffset();
            const assessmentCompletedActionHistory: JobApplicationActionHistory =
                {
                    job_application_id: newJobApplication.id,
                    action_type:
                        ApplicationTimeline.APPLICATION_ASSESSMENT_COMPLETED,
                    value: undefined,
                    created_username: DEFAULT_CANDIDATE_USERNAME,
                    created_by: createdBy,
                    updated_by: createdBy,
                    created_at: createdDate,
                    updated_at: createdDate,
                };
            actionHistories.push(assessmentCompletedActionHistory);
        }

        await this.dataSource.transaction(async (manager) => {
            await manager.save(JobApplication, newJobApplication!);

            if (!isEmpty(actionHistories)) {
                await manager.save(
                    JobApplicationActionHistory,
                    actionHistories,
                );
            }

            if (!isEmpty(careers)) {
                await manager.insert(JobApplicationCareer, careers);
            }

            if (!isEmpty(contacts)) {
                await manager.save(JobApplicationContact, contacts);
            }

            if (!isEmpty(educations)) {
                await manager.insert(JobApplicationEducation, educations);
            }

            if (!isEmpty(resumes)) {
                await manager.save(JobApplicationResume, resumes);
            }

            const tmpNewAttachments: JobApplicationAttachment[] = [];
            if (!isEmpty(attachments)) {
                for (const attachment of attachments) {
                    const newAttachment = await manager.save(
                        JobApplicationAttachment,
                        attachment,
                    );
                    if (!tmpNewAttachments.includes(newAttachment)) {
                        tmpNewAttachments.push(newAttachment);
                    }
                }
            }

            if (!isEmpty(screeningAnswers)) {
                const parsedScreeningAnswers =
                    await this.assignAttachmentToScreeningAnswer(
                        tmpNewAttachments,
                        screeningAnswers,
                    );
                await manager.save(
                    JobApplicationScreeningAnswer,
                    parsedScreeningAnswers,
                );
            }

            if (!isEmpty(questionnaires)) {
                await manager.save(JobApplicationQuestionnaire, questionnaires);
            }
        });

        /** publish event for person sqs */
        newJobApplication.job = job;
        await this.sendTASubmitApplicationEvent(
            newJobApplication,
            createdBy,
            resumes?.length ? resumes[0] : null,
            careers,
            questionnaires,
        );

        return newJobApplication.id;
    }

    async retrySendSubmitJobApp(jobApplication: JobApplication): Promise<void> {
        const resume = await this.dataSource
            .getRepository(JobApplicationResume)
            .findOneBy({ job_application_id: jobApplication.id });
        const careers = await this.dataSource
            .getRepository(JobApplicationCareer)
            .findBy({ job_application_id: jobApplication.id });
        const questionnaires = await this.dataSource
            .getRepository(JobApplicationQuestionnaire)
            .findBy({ job_application_id: jobApplication.id });

        await this.sendTASubmitApplicationEvent(
            jobApplication,
            jobApplication.created_by,
            resume,
            careers,
            questionnaires,
        );
    }

    async sendTASubmitApplicationEvent(
        jobApplication: JobApplication,
        createdBy: number,
        resume?: JobApplicationResume | null,
        careers?: JobApplicationCareer[],
        questionnaires?: JobApplicationQuestionnaire[],
    ): Promise<void> {
        const data = new TalentAcquisitionApplicationSubmitted(
            jobApplication,
            resume ?? null,
            careers ?? [],
            questionnaires ?? [],
        );
        const message: IEventModel<TalentAcquisitionApplicationSubmitted> = {
            event_type:
                TalentAcquisitionEventType.TALENT_ACQUISITION_APPLICATION_SUBMITTED,
            event_id: jobApplication.id,
            company_id: jobApplication.company_id,
            user_account_id: createdBy,
            data,
        };

        await this.publisherService.sendMessage(message);
    }

    async assignAttachmentToScreeningAnswer(
        newAttachments: JobApplicationAttachment[],
        currScreeningAnswers: JobApplicationScreeningAnswer[],
    ): Promise<JobApplicationScreeningAnswer[]> {
        if (newAttachments?.length && currScreeningAnswers?.length) {
            currScreeningAnswers.forEach((x: JobApplicationScreeningAnswer) => {
                const answer = x.answer as SafeAny;
                if (answer && answer['value']) {
                    const answerValue = answer['value'];

                    if (
                        Array.isArray(answerValue) &&
                        answerValue.length === 3
                    ) {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        const [_, attFilePath] = answerValue;
                        newAttachments.forEach(
                            (attachment: JobApplicationAttachment) => {
                                if (attachment.file_path) {
                                    const fileName = getFilename(attFilePath);

                                    if (
                                        attachment.file_name === fileName &&
                                        attachment.file_path === attFilePath
                                    ) {
                                        x.attachment_file_id = attachment.id;
                                    }
                                }
                            },
                        );
                    } else {
                        // todo :: to be remove in future patch
                        const answerAttachmentValue =
                            new CandidateScreeningAttachmentAnswer(
                                answer['value'],
                            );

                        if (answerAttachmentValue.file_path?.length) {
                            const attFilePath = answerAttachmentValue.file_path;
                            newAttachments.forEach(
                                (attachment: JobApplicationAttachment) => {
                                    if (attachment.file_path) {
                                        const fileName =
                                            getFilename(attFilePath);

                                        if (
                                            attachment.file_name === fileName &&
                                            attachment.file_path === attFilePath
                                        ) {
                                            x.attachment_file_id =
                                                attachment.id;
                                        }
                                    }
                                },
                            );
                        }
                    }
                }
            });
        }

        return currScreeningAnswers;
    }

    async updateJobApplicationQuestionnaire(
        updatedBy: number,
        payload: CandidateApplicationAssessmentSubmitted,
    ): Promise<JobApplicationQuestionnaireDto> {
        if (!payload.job_application_id) {
            throw new Error(LambdaErrorMsg.INVALID_JOB_APPLICATION);
        }

        const jobApplicationBuilder = new JobApplicationQueryBuilder(
            this.dataSource.getRepository(JobApplication),
        )
            .relateQuestionnaires()
            .whereCandidateApplicationIs(payload.job_application_id)
            .build();
        const jobApplication = await jobApplicationBuilder.getOne();
        if (!jobApplication) {
            throw new Error(LambdaErrorMsg.INVALID_JOB_APPLICATION);
        }

        const jobBuilder = new JobQueryBuilder(
            this.dataSource.getRepository(Job),
        )
            .relateQuestionnaires()
            .whereJobIs(jobApplication.job_id)
            .build();
        const job = await jobBuilder.getOne();
        if (!job) {
            throw new Error(LambdaErrorMsg.INVALID_JOB);
        }
        jobApplication.job = job;

        const jobApplicationQuestionnaires = jobApplication.questionnaires;

        let otherQuestionnaires: JobApplicationQuestionnaire[] = [];
        let currJobApplicationQuestionnaire:
            | JobApplicationQuestionnaire
            | undefined;
        if (
            jobApplicationQuestionnaires &&
            !isEmpty(jobApplicationQuestionnaires)
        ) {
            otherQuestionnaires = jobApplicationQuestionnaires.filter(
                (q) => q.questionnaire_id !== payload.questionnaire_id,
            );
            [currJobApplicationQuestionnaire] =
                jobApplicationQuestionnaires.filter(
                    (q) => q.questionnaire_id === payload.questionnaire_id,
                );
        }

        const newQuestionnaire: JobApplicationQuestionnaire = {
            job_application_id: jobApplication.id,
            questionnaire_framework: payload.questionnaire_framework,
            questionnaire_id: payload.questionnaire_id,
            attempts: payload.attempts,
            started_at: payload.started_at,
            completed_at: payload.completed_at,
            question_answer_raw: objectParser.toJSON(
                payload.question_answer_raw,
            ),
            result_raw: objectParser.toJSON(payload.result_raw),
            created_by:
                currJobApplicationQuestionnaire?.created_by ?? updatedBy,
            updated_by: updatedBy,
        };

        let assessmentCompletionPercentage =
            jobApplication.assessment_completion_percentage;
        let totalQuestionnaireCompleted = otherQuestionnaires.length;
        totalQuestionnaireCompleted = otherQuestionnaires.length + 1;

        const completedQuestionnaires = [
            ...otherQuestionnaires,
            newQuestionnaire,
        ];
        assessmentCompletionPercentage =
            ScreeningUtils.calculateAssessmentCompletionPercentage(
                completedQuestionnaires,
                jobApplication.total_questionnaires,
            );

        let assessmentCompletedAt = jobApplication.assessment_completed_at;
        if (
            !assessmentCompletedAt &&
            payload.questionnaire_framework !== QuestionnaireFramework.VIDEO
        ) {
            assessmentCompletedAt = this.populateAssessmentCompletedAt(
                job.questionnaires!,
                completedQuestionnaires,
                payload.completed_at!,
            );
        }

        await this.dataSource.transaction(async (manager) => {
            if (currJobApplicationQuestionnaire?.id) {
                await manager.update(
                    JobApplicationQuestionnaire,
                    { id: currJobApplicationQuestionnaire.id },
                    newQuestionnaire,
                );
            } else {
                await manager.save(
                    JobApplicationQuestionnaire,
                    newQuestionnaire,
                );
            }

            await manager.update(
                JobApplication,
                { id: jobApplication.id },
                {
                    updated_by: updatedBy,
                    total_questionnaires_completed: totalQuestionnaireCompleted,
                    assessment_completion_percentage:
                        assessmentCompletionPercentage,
                    assessment_completed_at: assessmentCompletedAt,
                },
            );

            if (
                isNil(jobApplication.assessment_completed_at) &&
                !isNil(assessmentCompletedAt)
            ) {
                const assessmentCompletedActionHistory: JobApplicationActionHistory =
                    {
                        job_application_id: jobApplication.id,
                        action_type:
                            ApplicationTimeline.APPLICATION_ASSESSMENT_COMPLETED,
                        value: undefined,
                        created_username: DEFAULT_CANDIDATE_USERNAME,
                        created_by: updatedBy,
                        updated_by: updatedBy,
                    };
                await manager.save(
                    JobApplicationActionHistory,
                    assessmentCompletedActionHistory,
                );
            }

            if (
                payload.questionnaire_framework === QuestionnaireFramework.VIDEO
            ) {
                const videoInterviewActionHistory: JobApplicationActionHistory =
                    {
                        job_application_id: jobApplication.id,
                        action_type:
                            ApplicationTimeline.APPLICATION_VIDEO_INTERVIEW_COMPLETED,
                        value: undefined,
                        created_username: DEFAULT_CANDIDATE_USERNAME,
                        created_by: updatedBy,
                        updated_by: updatedBy,
                    };
                await manager.save(
                    JobApplicationActionHistory,
                    videoInterviewActionHistory,
                );
            }
        });

        const jobApplicationQuestionnaireRepo = this.dataSource.getRepository(
            JobApplicationQuestionnaire,
        );
        const savedQuestionnaire =
            await jobApplicationQuestionnaireRepo.findOne({
                where: {
                    job_application_id: jobApplication.id,
                    questionnaire_id: newQuestionnaire.questionnaire_id,
                },
            });
        if (!savedQuestionnaire) {
            throw new Error(LambdaErrorMsg.NO_QUESTIONNAIRE_FOUND);
        }

        /** publish event for person sqs */
        const data = new TalentAcquisitionAssessmentSubmitted(
            jobApplication,
            savedQuestionnaire,
        );

        const message: IEventModel<TalentAcquisitionAssessmentSubmitted> = {
            event_type:
                TalentAcquisitionEventType.TALENT_ACQUISITION_ASSESSMENT_SUBMITTED,
            event_id: jobApplication.id,
            company_id: jobApplication.company_id,
            user_account_id: updatedBy,
            data,
        };

        await this.publisherService.sendMessage(message);

        return new JobApplicationQuestionnaireDto(newQuestionnaire);
    }

    async completedJobApplication(
        updatedBy: number,
        payload: CandidateApplicationCompleted,
    ): Promise<string> {
        const jobBuilder = new JobQueryBuilder(
            this.dataSource.getRepository(Job),
        )
            .relateQuestionnaires()
            .whereJobIs(payload.job_id)
            .build();
        const job = await jobBuilder.getOne();
        if (!job) {
            throw new Error(LambdaErrorMsg.INVALID_JOB);
        }

        const jobApplicationBuilder = new JobApplicationQueryBuilder(
            this.dataSource.getRepository(JobApplication),
        )
            .relateQuestionnaires()
            .whereCandidateApplicationIs(payload.id)
            .build();
        const jobApplication = await jobApplicationBuilder.getOne();
        if (!jobApplication) {
            throw new Error(LambdaErrorMsg.INVALID_JOB_APPLICATION);
        }

        let assessmentCompletedAt = jobApplication.assessment_completed_at;
        if (!assessmentCompletedAt) {
            assessmentCompletedAt = this.populateAssessmentCompletedAt(
                job.questionnaires!,
                jobApplication.questionnaires!,
                payload.completed_at!,
            );
        }

        await this.dataSource.transaction(async (manager) => {
            await manager.update(
                JobApplication,
                { id: jobApplication.id },
                {
                    updated_by: updatedBy,
                    is_questionnaires_required:
                        payload.is_questionnaires_required
                            ? payload.is_questionnaires_required
                            : jobApplication.is_questionnaires_required,
                    is_video_required: payload.is_video_required
                        ? payload.is_video_required
                        : jobApplication.is_video_required,
                    total_questionnaires: payload.total_questionnaires
                        ? payload.total_questionnaires
                        : jobApplication.total_questionnaires,
                    total_questionnaires_completed:
                        payload.total_questionnaires_completed
                            ? payload.total_questionnaires_completed
                            : jobApplication.total_questionnaires_completed,
                    assessment_completed_at: assessmentCompletedAt,
                    completed_at: payload.completed_at,
                },
            );

            if (
                jobApplication.assessment_completed_at !== assessmentCompletedAt
            ) {
                const assessmentCompletedActionHistory: JobApplicationActionHistory =
                    {
                        job_application_id: jobApplication.id,
                        action_type:
                            ApplicationTimeline.APPLICATION_ASSESSMENT_COMPLETED,
                        value: undefined,
                        created_username: DEFAULT_CANDIDATE_USERNAME,
                        created_by: updatedBy,
                        updated_by: updatedBy,
                    };
                await manager.save(
                    JobApplicationActionHistory,
                    assessmentCompletedActionHistory,
                );
            }
        });

        return jobApplication.id;
    }

    async withdrawnJobApplication(
        updatedBy: number,
        payload: CandidateApplicationWithdrawn,
    ): Promise<string> {
        const jobBuilder = new JobQueryBuilder(
            this.dataSource.getRepository(Job),
        )
            .whereJobIs(payload.job_id)
            .build();
        const job = await jobBuilder.getOne();
        if (!job) {
            throw new Error(LambdaErrorMsg.INVALID_JOB);
        }

        const jobApplicationBuilder = new JobApplicationQueryBuilder(
            this.dataSource.getRepository(JobApplication),
        )
            .whereCandidateApplicationIs(payload.id)
            .build();
        const jobApplication = await jobApplicationBuilder.getOne();
        if (!jobApplication) {
            throw new Error(LambdaErrorMsg.INVALID_JOB_APPLICATION);
        }

        const appliedActionHistory: JobApplicationActionHistory = {
            job_application_id: jobApplication.id,
            action_type: ApplicationTimeline.APPLICATION_CANDIDATE_WITHDRAWN,
            value: objectParser.toJSON({
                status: JobApplicationStatus.WITHDRAWN,
                drop_out_reason: payload.withdrawn_reason,
            }),
            created_username: DEFAULT_CANDIDATE_USERNAME,
            created_by: updatedBy,
            updated_by: updatedBy,
        };

        await this.dataSource.transaction(async (manager) => {
            await manager.update(
                JobApplication,
                { id: jobApplication.id },
                {
                    status: JobApplicationStatus.WITHDRAWN,
                    drop_out_reason: payload.withdrawn_reason,
                    drop_out_at: payload.withdrawn_at,
                    last_status_changed_at: payload.withdrawn_at,
                },
            );

            await manager.save(
                JobApplicationActionHistory,
                appliedActionHistory,
            );
        });

        return jobApplication.id;
    }

    async markJobApplicationAssessmentStarted(
        updatedBy: number,
        payload: CandidateApplicationAssessmentStarted,
    ): Promise<string> {
        if (!payload.job_application_id) {
            throw new Error(LambdaErrorMsg.INVALID_JOB_APPLICATION);
        }

        const jobApplicationBuilder = new JobApplicationQueryBuilder(
            this.dataSource.getRepository(JobApplication),
        )
            .whereCandidateApplicationIs(payload.job_application_id)
            .build();
        const jobApplication = await jobApplicationBuilder.getOne();
        if (!jobApplication) {
            throw new Error(LambdaErrorMsg.INVALID_JOB_APPLICATION);
        }

        if (payload.questionnaire_framework === QuestionnaireFramework.VIDEO) {
            return jobApplication.id;
        }

        if (!jobApplication.assessment_started_at) {
            await this.dataSource.transaction(async (manager) => {
                await manager.update(
                    JobApplication,
                    { id: jobApplication.id },
                    {
                        assessment_started_at: payload.started_at,
                        updated_by: updatedBy,
                    },
                );
            });
        }

        return jobApplication.id;
    }

    async updateJobApplicationAfterImportedAsEmployee(
        updatedBy: number,
        payload: EmployeeImportedEvent,
    ): Promise<void> {
        if (!payload.job_application_id) {
            throw new Error(LambdaErrorMsg.INVALID_JOB_APPLICATION);
        }

        if (!payload.employee_id) {
            throw new Error(LambdaErrorMsg.INVALID_EMPLOYEE_ID);
        }

        const jobApplicationBuilder = new JobApplicationQueryBuilder(
            this.dataSource.getRepository(JobApplication),
        )
            .whereJobApplicationIs(payload.job_application_id)
            .build();

        const jobApplication = await jobApplicationBuilder.getOne();
        if (!jobApplication) {
            throw new Error(LambdaErrorMsg.INVALID_JOB_APPLICATION);
        }
        const actionHistoryPayload: JobApplicationActionHistory = {
            job_application_id: jobApplication.id,
            action_type: ApplicationTimeline.APPLICATION_IMPORTED_AS_EMPLOYEE,
            created_username: payload.user_display_name,
            created_by: updatedBy,
            updated_by: updatedBy,
        };

        await this.dataSource.transaction(async (manager) => {
            await manager.update(
                JobApplication,
                { id: jobApplication.id },
                {
                    ext_employee_id: payload.employee_id,
                    updated_by: updatedBy,
                },
            );

            await manager.save(
                JobApplicationActionHistory,
                actionHistoryPayload,
            );
        });
    }

    private populateAssessmentCompletedAt(
        jobQuestionnaires: JobQuestionnaire[],
        jobApplicationQuestionnaires: JobApplicationQuestionnaire[],
        defaultCompletedAt: Date,
    ): Date | null {
        const totalAssessmentOnly = jobQuestionnaires.filter(
            (q) => q.questionnaire_framework !== QuestionnaireFramework.VIDEO,
        ).length;

        if (totalAssessmentOnly === 0) {
            return null;
        }

        const totalAssessmentOnlyCompleted =
            jobApplicationQuestionnaires.filter(
                (q) =>
                    q.questionnaire_framework !== QuestionnaireFramework.VIDEO,
            ).length;
        const assessmentCompletedAt =
            totalAssessmentOnly === totalAssessmentOnlyCompleted
                ? defaultCompletedAt
                : null;

        return assessmentCompletedAt;
    }
}
