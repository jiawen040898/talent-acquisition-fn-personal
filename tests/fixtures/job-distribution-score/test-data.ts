import { JobApplicationScoreType } from '@pulsifi/constants';
import { testJobDistinctionScoreBuilder } from '@pulsifi/tests/builders';

export const workStyleDistribution = testJobDistinctionScoreBuilder.build({
    score_type: JobApplicationScoreType.WORK_STYLE,
});
export const reasoningLogicalDistribution =
    testJobDistinctionScoreBuilder.build({
        score_type: JobApplicationScoreType.REASONING_LOGICAL,
    });
