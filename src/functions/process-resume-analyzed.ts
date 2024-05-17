import {
    TalentAcquisitionApplicationSubmitted,
    TalentAcquisitionApplicationUpdated,
} from '@pulsifi/dtos';
import { logger, sqsRecordUtil } from '@pulsifi/fn';
import {
    JobApplicationScoreService,
    JobApplicationSkillExtractionService,
} from '@pulsifi/services';
import { SQSEvent } from 'aws-lambda';

import { getDataSource } from '../database';
import { IEventModel } from '../interfaces';
import { eventMiddleware } from '../middleware';

type ResumeExtractPayload =
    | TalentAcquisitionApplicationSubmitted
    | TalentAcquisitionApplicationUpdated;

export const handleEvent = async (event: SQSEvent) => {
    for (const record of event.Records) {
        const message =
            sqsRecordUtil.parseBodyMessage<IEventModel<SafeAny>>(record);

        logger.info('message', message);
        const currEventType = message.event_type.toLowerCase();

        const resumeExtractSkillPayload: ResumeExtractPayload = <
            ResumeExtractPayload
        >message.data;

        const dataSource = await getDataSource();

        await dataSource.transaction(async (manager) => {
            const jobApplicationSkills =
                await JobApplicationSkillExtractionService.extractJobApplicationSkills(
                    +message.user_account_id,
                    resumeExtractSkillPayload,
                    manager,
                );

            if (jobApplicationSkills) {
                const jobApplicationScoreService =
                    new JobApplicationScoreService(manager);
                await jobApplicationScoreService.updatePairwiseScores(
                    +message.user_account_id,
                    resumeExtractSkillPayload.job_application_id,
                    jobApplicationSkills,
                    manager,
                );
            }
        });

        logger.info(`Completed ${currEventType}`, {
            event: currEventType,
            payload: resumeExtractSkillPayload,
            success: true,
        });
    }
};

export const handler = eventMiddleware(handleEvent);
