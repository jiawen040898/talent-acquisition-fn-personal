import { TalentAcquisitionAssessmentScoreCalculated } from '@pulsifi/dtos';
import { logger, sqsRecordUtil } from '@pulsifi/fn';
import { IEventModel } from '@pulsifi/interfaces';
import { SQSEvent } from 'aws-lambda';

import { getDataSource } from '../database';
import { eventMiddleware } from '../middleware';
import { JobDistributionScoreService } from '../services/job-distribution-score.service';

export const handleEvent = async (event: SQSEvent) => {
    for (const record of event.Records) {
        const message =
            sqsRecordUtil.parseBodyMessage<
                IEventModel<TalentAcquisitionAssessmentScoreCalculated>
            >(record);

        logger.info('message', message);
        const currEventType = message.event_type.toLowerCase();

        const domainScoreData = message.data;

        const dataSource = await getDataSource();

        await dataSource.transaction(async (manager) => {
            for (const jobApplicationScore of domainScoreData.job_application_scores) {
                await JobDistributionScoreService.updateJobDistributionScore(
                    domainScoreData.job_id,
                    jobApplicationScore,
                    manager,
                );
            }
        });

        logger.info(`Completed ${currEventType}`, {
            event: currEventType,
            payload: domainScoreData,
            success: true,
        });
    }
};

export const handler = eventMiddleware(handleEvent);
