import { JobApplicationScoreType } from '@pulsifi/constants';
import { JobDistributionScore } from '@pulsifi/models';

export const jobDistributionScoreTestData: JobDistributionScore = {
    id: 1,
    company_id: 185,
    job_id: 'b9116f07-9c40-4bed-9ea4-69a5e42190be',
    score_type: JobApplicationScoreType.WORK_STYLE,
    size: 1872,
    mean: 0.76276788,
    variance: 0.00770153,
    alpha: 17.159,
    beta: 5.3367,
    version: new Date('2022-02-01'),
    created_by: 1,
    updated_by: 1,
};
