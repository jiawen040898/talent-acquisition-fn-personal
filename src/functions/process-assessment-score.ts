import { TalentAcquisitionEventType } from '@pulsifi/constants';
import {
    JobApplicationQuestionnaireDto,
    TalentAcquisitionApplicationSubmitted,
    TalentAcquisitionAssessmentSubmitted,
} from '@pulsifi/dtos';
import { logger, sqsRecordUtil } from '@pulsifi/fn';
import { IEventModel } from '@pulsifi/interfaces';
import { JobApplicationScoreService } from '@pulsifi/services';
import { SQSEvent } from 'aws-lambda';

import { getDataSource } from '../database';
import { eventMiddleware } from '../middleware';

export const handleEvent = async (event: SQSEvent) => {
    for (const record of event.Records) {
        const message =
            sqsRecordUtil.parseBodyMessage<
                IEventModel<
                    | TalentAcquisitionApplicationSubmitted
                    | TalentAcquisitionAssessmentSubmitted
                >
            >(record);

        logger.info('message', message);

        const currEventType = message.event_type.toLowerCase();

        if (
            ![
                TalentAcquisitionEventType.TALENT_ACQUISITION_APPLICATION_SUBMITTED,
                TalentAcquisitionEventType.TALENT_ACQUISITION_ASSESSMENT_SUBMITTED,
            ].includes(currEventType as TalentAcquisitionEventType)
        ) {
            logger.info('event type not supported', {
                eventType: currEventType,
            });
            return;
        }

        const data = message.data;
        const assessments: JobApplicationQuestionnaireDto[] = [];

        if (
            currEventType ===
            TalentAcquisitionEventType.TALENT_ACQUISITION_ASSESSMENT_SUBMITTED
        ) {
            assessments.push(
                (data as TalentAcquisitionAssessmentSubmitted).assessment,
            );
        }
        if (
            currEventType ===
            TalentAcquisitionEventType.TALENT_ACQUISITION_APPLICATION_SUBMITTED
        ) {
            assessments.push(
                ...((data as TalentAcquisitionApplicationSubmitted)
                    .assessments ?? []),
            );
        }

        if (assessments.length) {
            const dataSource = await getDataSource();
            const jobApplicationScoreService = new JobApplicationScoreService(
                dataSource,
            );

            await jobApplicationScoreService.processAssessmentScore(
                message.user_account_id,
                data.job_application_id,
                assessments,
                data.role_fit_recipe_id,
                data.culture_fit_recipe_id,
            );
        }

        logger.info(`Completed ${currEventType}`, {
            event: currEventType,
            payload: message.data,
            success: true,
        });
    }
};

export const handler = eventMiddleware(handleEvent);
