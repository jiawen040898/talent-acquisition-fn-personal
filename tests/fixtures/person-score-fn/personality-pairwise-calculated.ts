import {
    JobApplicationScoreType,
    PersonalityPairwiseSkillAlias,
} from '@pulsifi/constants';
import {
    JobApplicationScoreDto,
    PairwiseScoreDto,
    PersonalityPairwiseScoreCalculated,
} from '@pulsifi/dtos';
import { generatorUtil, objectParser } from '@pulsifi/fn';
import { ScreeningUtils } from '@pulsifi/shared';

export const mockHardSkillPairwiseScore: PairwiseScoreDto = {
    domain_alias: PersonalityPairwiseSkillAlias.HARD_SKILL,
    domain_score: 0.4177033305168152,
    pairwise_skill: [
        {
            skill_name: 'AJAX',
            matches: [
                {
                    skill_name: 'testing',
                    score: -0.008632432669401169,
                    match: false,
                },
                {
                    skill_name: 'coding',
                    score: 0.17299911379814148,
                    match: false,
                },
            ],
        },
        {
            skill_name: 'Bootstrap',
            matches: [
                {
                    skill_name: 'testing',
                    score: 0.2698603570461273,
                    match: false,
                },
                {
                    skill_name: 'coding',
                    score: 0.22613030672073364,
                    match: false,
                },
            ],
        },
        {
            skill_name: 'Cascading Style Sheets',
            matches: [
                {
                    skill_name: 'testing',
                    score: 0.21852615475654602,
                    match: false,
                },
                {
                    skill_name: 'coding',
                    score: 0.17236873507499695,
                    match: false,
                },
            ],
        },
        {
            skill_name: 'HTML',
            matches: [
                {
                    skill_name: 'testing',
                    score: 0.05895738676190376,
                    match: false,
                },
                {
                    skill_name: 'coding',
                    score: 0.2576451897621155,
                    match: false,
                },
            ],
        },
        {
            skill_name: 'JSON',
            matches: [
                {
                    skill_name: 'testing',
                    score: 0.1734754592180252,
                    match: false,
                },
                {
                    skill_name: 'coding',
                    score: 0.25983160734176636,
                    match: false,
                },
            ],
        },
        {
            skill_name: 'JavaScript',
            matches: [
                {
                    skill_name: 'testing',
                    score: 0.2338239848613739,
                    match: false,
                },
                {
                    skill_name: 'coding',
                    score: 0.41823920607566833,
                    match: false,
                },
            ],
        },
        {
            skill_name: 'MySQL',
            matches: [
                {
                    skill_name: 'testing',
                    score: 0.20107847452163696,
                    match: false,
                },
                {
                    skill_name: 'coding',
                    score: 0.19634759426116943,
                    match: false,
                },
            ],
        },
        {
            skill_name: 'Object Oriented Analysis/Design',
            matches: [
                {
                    skill_name: 'testing',
                    score: 0.36293116211891174,
                    match: false,
                },
                {
                    skill_name: 'coding',
                    score: 0.3547314703464508,
                    match: false,
                },
            ],
        },
        {
            skill_name: 'XML',
            matches: [
                {
                    skill_name: 'testing',
                    score: 0.07474055886268616,
                    match: false,
                },
                {
                    skill_name: 'coding',
                    score: 0.17974795401096344,
                    match: false,
                },
            ],
        },
        {
            skill_name: 'jQuery',
            matches: [
                {
                    skill_name: 'testing',
                    score: 0.4171674847602844,
                    match: false,
                },
                {
                    skill_name: 'coding',
                    score: 0.37833288311958313,
                    match: false,
                },
            ],
        },
    ],
    ingredient_weightage: 0.05,
};

export const mockWorkExpPairwiseScore: PairwiseScoreDto = {
    domain_alias: PersonalityPairwiseSkillAlias.WORK_EXPERIENCE,
    domain_score: 0.44212663173675537,
    pairwise_title: [
        {
            previous_employment: 'Data Engineer',
            matches: [{ job_title: 'job role A', score: 0.44212663173675537 }],
        },
        {
            previous_employment: 'Data Scientist',
            matches: [{ job_title: 'job role A', score: 0.31493091583251953 }],
        },
    ],
    ingredient_weightage: 0.05,
};

export const mockJAPersonalityPairwiseScore: PersonalityPairwiseScoreCalculated =
    {
        id: generatorUtil.uuid(),
        person_id: generatorUtil.uuid(),
        person_type: 'candidate',
        job_score_recipe_id: generatorUtil.uuid(),
        process_id: 1,
        process_type: 'program',
        payload: [mockHardSkillPairwiseScore, mockWorkExpPairwiseScore],
    };

export const hardSkillScore: JobApplicationScoreDto = {
    id: 4,
    job_application_id: generatorUtil.uuid(),
    score_recipe_id: mockJAPersonalityPairwiseScore.job_score_recipe_id,
    score_outcome: objectParser.toJSON({
        pairwise_result: mockHardSkillPairwiseScore.pairwise_skill,
    }),
    score_type: JobApplicationScoreType.HARD_SKILL,
    score_dimension: 0,
    score: ScreeningUtils.parseDecimal(
        mockHardSkillPairwiseScore.domain_score * 10,
    ),
    percentile: undefined,
    percentile_source: undefined,
    percentile_api_version: undefined,
};

export const workExpScore: JobApplicationScoreDto = {
    id: 5,
    job_application_id: generatorUtil.uuid(),
    score_recipe_id: mockJAPersonalityPairwiseScore.job_score_recipe_id,
    score_outcome: objectParser.toJSON({
        pairwise_result: mockWorkExpPairwiseScore.pairwise_title,
    }),
    score_type: JobApplicationScoreType.WORK_EXP,
    score_dimension: 0,
    score: ScreeningUtils.parseDecimal(
        mockWorkExpPairwiseScore.domain_score * 10,
    ),
    percentile: undefined,
    percentile_source: undefined,
    percentile_api_version: undefined,
};
