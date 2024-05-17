import {
    TalentAcquisitionAssessmentScoreCalculated,
    TalentAcquisitionPairWiseScoreCalculated,
} from '@pulsifi/dtos';
import { logger, sqsRecordUtil } from '@pulsifi/fn';
import { JobApplicationScoreService } from '@pulsifi/services';
import { SQSEvent } from 'aws-lambda';

import { getDataSource } from '../database';
import { IEventModel } from '../interfaces';
import { eventMiddleware } from '../middleware';

type ScoreCalculatedPayload =
    | TalentAcquisitionPairWiseScoreCalculated
    | TalentAcquisitionAssessmentScoreCalculated;

export const handleEvent = async (event: SQSEvent) => {
    for (const record of event.Records) {
        const message =
            sqsRecordUtil.parseBodyMessage<IEventModel<SafeAny>>(record);

        logger.info('message', message);

        const currEventType = message.event_type.toLowerCase();

        const scoreCalculatedPayload: ScoreCalculatedPayload = <
            ScoreCalculatedPayload
        >message.data;

        const dataSource = await getDataSource();

        const jobApplicationScoreService = new JobApplicationScoreService(
            dataSource,
        );

        await jobApplicationScoreService.updateFitScore(
            scoreCalculatedPayload.job_application_id,
            message.user_account_id,
            scoreCalculatedPayload.role_fit_recipe_id,
            scoreCalculatedPayload.culture_fit_recipe_id,
        );

        logger.info(`Completed ${currEventType}`, {
            event: currEventType,
            payload: scoreCalculatedPayload,
            success: true,
        });
    }
};

export const handler = eventMiddleware(handleEvent);
