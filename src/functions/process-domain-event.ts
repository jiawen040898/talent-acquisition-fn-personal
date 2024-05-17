import {
    CandidateApplicationAssessmentStarted,
    CandidateApplicationAssessmentSubmitted,
    CandidateApplicationCompleted,
    CandidateApplicationSubmitted,
    CandidateApplicationUpdated,
    CandidateApplicationWithdrawn,
    EmployeeImportedEvent,
    IdentityUpdateUserEventDto,
    JobApplicationQuestionnaireDto,
} from '@pulsifi/dtos';
import { logger, sqsRecordUtil } from '@pulsifi/fn';
import { JobApplicationService, JobUserAccessService } from '@pulsifi/services';
import { SQSEvent } from 'aws-lambda';

import {
    CandidateEventType,
    IdentityEventType,
    TalentManagementEventType,
} from '../constants';
import { getDataSource } from '../database';
import { IEventModel } from '../interfaces';
import { eventMiddleware } from '../middleware';

export const handleEvent = async (_event: SQSEvent) => {
    const dataSource = await getDataSource();

    const jobApplicationService = new JobApplicationService(dataSource);
    const jobUserAccessService = new JobUserAccessService(dataSource);

    for (const record of _event.Records) {
        const message =
            sqsRecordUtil.parseBodyMessage<IEventModel<SafeAny>>(record);

        logger.info('message', message);
        const currEventType: string = message.event_type.toLowerCase();

        switch (currEventType) {
            case CandidateEventType.APPLICATION_COMPLETED:
                const applicationCompletedPayload: CandidateApplicationCompleted =
                    <CandidateApplicationCompleted>(<unknown>message.data);

                const completedJobApplicationId: string =
                    await jobApplicationService.completedJobApplication(
                        +message.user_account_id,
                        applicationCompletedPayload,
                    );

                logger.info(
                    `Completed ${CandidateEventType.APPLICATION_COMPLETED}`,
                    {
                        event: CandidateEventType.APPLICATION_COMPLETED,
                        job_application_id: completedJobApplicationId,
                    },
                );
                break;

            case CandidateEventType.APPLICATION_SUBMITTED:
                const applicationSubmittedPayload: CandidateApplicationSubmitted =
                    <CandidateApplicationSubmitted>(<unknown>message.data);

                const newJobApplicationId: string =
                    await jobApplicationService.createJobApplication(
                        +message.user_account_id,
                        applicationSubmittedPayload,
                    );

                logger.info(
                    `Completed ${CandidateEventType.APPLICATION_SUBMITTED}`,
                    {
                        event: CandidateEventType.APPLICATION_SUBMITTED,
                        job_application_id: newJobApplicationId,
                    },
                );
                break;

            case CandidateEventType.APPLICATION_UPDATED:
            case CandidateEventType.APPLICATION_RESUME_UPLOADED:
                const applicationUpdatedPayload: CandidateApplicationUpdated = <
                    CandidateApplicationUpdated
                >(<unknown>message.data);

                const updatedApplicationId: string =
                    await jobApplicationService.updateJobApplication(
                        +message.user_account_id,
                        applicationUpdatedPayload,
                    );

                logger.info(
                    `Completed ${CandidateEventType.APPLICATION_UPDATED}`,
                    {
                        event: CandidateEventType.APPLICATION_UPDATED,
                        job_application_id: updatedApplicationId,
                    },
                );
                break;

            case CandidateEventType.ASSESSMENT_SUBMITTED:
                const assessmentSubmittedPayload: CandidateApplicationAssessmentSubmitted =
                    <CandidateApplicationAssessmentSubmitted>(
                        (<unknown>message.data)
                    );

                const assessmentSubmittedOutput: JobApplicationQuestionnaireDto =
                    await jobApplicationService.updateJobApplicationQuestionnaire(
                        +message.user_account_id,
                        assessmentSubmittedPayload,
                    );

                logger.info(
                    `Completed ${CandidateEventType.ASSESSMENT_SUBMITTED}`,
                    {
                        job_application_id:
                            assessmentSubmittedOutput.job_application_id,
                        event: CandidateEventType.ASSESSMENT_SUBMITTED,
                    },
                );
                break;

            case CandidateEventType.APPLICATION_WITHDRAWN:
                const applicationWithdrawnPayload: CandidateApplicationWithdrawn =
                    <CandidateApplicationWithdrawn>(<unknown>message.data);

                const withdrawnJobApplicationId: string =
                    await jobApplicationService.withdrawnJobApplication(
                        +message.user_account_id,
                        applicationWithdrawnPayload,
                    );

                logger.info(
                    `Completed ${CandidateEventType.APPLICATION_WITHDRAWN}`,
                    {
                        event: CandidateEventType.APPLICATION_WITHDRAWN,
                        job_application_id: withdrawnJobApplicationId,
                    },
                );
                break;
            // case CandidateEventType.APPLICATION_SIGNUP:
            case CandidateEventType.ASSESSMENT_STARTED:
                const applicationAssessmentStartedPayload: CandidateApplicationAssessmentStarted =
                    <CandidateApplicationAssessmentStarted>(
                        (<unknown>message.data)
                    );

                const startedJobApplicationId: string =
                    await jobApplicationService.markJobApplicationAssessmentStarted(
                        +message.user_account_id,
                        applicationAssessmentStartedPayload,
                    );

                logger.info(
                    `Completed ${CandidateEventType.ASSESSMENT_STARTED}`,
                    {
                        event: CandidateEventType.ASSESSMENT_STARTED,
                        job_application_id: startedJobApplicationId,
                    },
                );
                break;

            case IdentityEventType.IDENTITY_UPDATE_USER:
                const identityUpdateUserPayload: IdentityUpdateUserEventDto = <
                    IdentityUpdateUserEventDto
                >(<unknown>message.data);
                await jobUserAccessService.conditionalRemoveJobUserAccess(
                    identityUpdateUserPayload,
                );
                logger.info(`Completed ${currEventType}`, {
                    event: currEventType,
                    payload: identityUpdateUserPayload,
                    success: true,
                });

                break;

            case IdentityEventType.IDENTITY_DELETE_USER:
                const identityDeleteUserPayload: IdentityUpdateUserEventDto = <
                    IdentityUpdateUserEventDto
                >(<unknown>message.data);
                await jobUserAccessService.removeJobUserAccess(
                    identityDeleteUserPayload,
                );
                logger.info(`Completed ${currEventType}`, {
                    event: currEventType,
                    payload: identityDeleteUserPayload,
                    success: true,
                });

                break;

            case TalentManagementEventType.TALENT_MANAGEMENT_EMPLOYEE_IMPORTED:
                const employeeImportedPayload: EmployeeImportedEvent = <
                    EmployeeImportedEvent
                >(<unknown>message.data);

                await jobApplicationService.updateJobApplicationAfterImportedAsEmployee(
                    +message.user_account_id,
                    employeeImportedPayload,
                );

                logger.info(`Completed ${currEventType}`, {
                    event: currEventType,
                    payload: employeeImportedPayload,
                    success: true,
                });
                break;

            default:
                break;
        }
    }
};

export const handler = eventMiddleware(handleEvent);
