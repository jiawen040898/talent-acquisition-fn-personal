import {
    JobApplicationScoreType,
    JobApplicationSkillSource,
} from '@pulsifi/constants';
import { JobApplicationSkill } from '@pulsifi/interfaces';
import { JobApplicationScore, JobDistributionScore } from '@pulsifi/models';
import { TestData, testUtil } from '@pulsifi/tests/setup';
import * as Factory from 'factory.ts';

export const testJobApplicationScoreBuilder =
    Factory.Sync.makeFactory<JobApplicationScore>({
        id: Factory.each((i) => i),
        job_application_id: Factory.each((i) => testUtil.mockUuid(i + 1)),
        score_recipe_id: Factory.each((i) => testUtil.mockUuid(i + 1)),
        score_outcome: {
            personality_result: [
                {
                    domain_alias: 'achievement_effort',
                    domain_score: 0.6041666666666666,
                    domain_weightage: 0.0627168877854,
                },
                {
                    domain_alias: 'persistence',
                    domain_score: 0.4375,
                    domain_weightage: 0.0645905770991,
                },
            ],
        },
        score_type: JobApplicationScoreType.WORK_STYLE,
        score_dimension: 1,
        score: 5.6899214,
        ...TestData.auditData,
    });

export const testJobApplicationSkillBuilder =
    Factory.Sync.makeFactory<JobApplicationSkill>({
        name: 'Javascript',
        source: JobApplicationSkillSource.DAXTRA,
    });

export const testJobDistinctionScoreBuilder =
    Factory.Sync.makeFactory<JobDistributionScore>({
        id: Factory.each((i) => i),
        job_id: '00000000-0000-0000-0000-000000000001',
        company_id: 1,
        score_type: JobApplicationScoreType.WORK_STYLE,
        size: 1872,
        mean: 0.76276788,
        variance: 0.00770153,
        alpha: 17.159,
        beta: 5.3367,
        version: new Date('2022-02-01'),
        ...TestData.auditData,
    });
