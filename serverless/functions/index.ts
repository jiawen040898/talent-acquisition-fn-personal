/* eslint-disable @typescript-eslint/naming-convention */
import { Functions } from 'serverless/aws';

import { processAssessmentScore } from './process-assessment-score-fn';
import { handleProcessDomainEvent } from './process-domain-event-fn';
import { processFitScore } from './process-fit-score-fn';
import { processJobDistributionScore } from './process-job-distribution-score-fn';
import { processResumeAnalyzed } from './process-resume-analyzed-fn';

export const functions: Functions = {
    receiver: handleProcessDomainEvent,
    processResumeAnalyzed,
    processFitScore,
    handleUpdateScoreDistribution: processJobDistributionScore,
    processAssessmentScore,
};
