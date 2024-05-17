import { JobApplicationScoreType } from '@pulsifi/constants';
import {
    JobApplicationScoreDto,
    PersonalityRoleFitScoreCalculated,
} from '@pulsifi/dtos';
import { generatorUtil, objectParser } from '@pulsifi/fn';
import { ScreeningUtils } from '@pulsifi/shared';

export const mockPersonalityFitScoreCalculated: PersonalityRoleFitScoreCalculated =
    {
        id: generatorUtil.uuid(),
        person_id: 'ec49542f-a548-478f-80e1-9be050544251',
        person_type: 'candidate',
        job_score_recipe_id: '0312047c-9542-4f3b-8d34-5d163fc208c6',
        process_id: 1,
        process_type: 'program',
        domain_alias: 'role_fit_score',
        domain_score: 0.45174405358557973,
        outcome: [
            {
                ingredient_alias: 'work_experience',
                ingredient_score: 0.44212663173675537,
                ingredient_weightage: 0.05,
            },
            {
                ingredient_alias: 'hard_skills',
                ingredient_score: 0.4177033305168152,
                ingredient_weightage: 0.05,
            },
            {
                ingredient_alias: 'work_value',
                ingredient_score: 0.5003589764641488,
                ingredient_weightage: 0.0542824899025897,
            },
            {
                ingredient_alias: 'work_style',
                ingredient_score: 0.5244899216618256,
                ingredient_weightage: 0.1542824899025897,
            },
            {
                ingredient_alias: 'interest_riasec',
                ingredient_score: 0.64286,
                ingredient_weightage: 0.1542824899025897,
            },
            {
                ingredient_alias: 'reasoning_verbal',
                ingredient_score: 0.6190476190476191,
                ingredient_weightage: 0.19449394155381328,
            },
            {
                ingredient_alias: 'reasoning_logical',
                ingredient_score: 0.125,
                ingredient_weightage: 0.1854953670705631,
            },
            {
                ingredient_alias: 'reasoning_numeric',
                ingredient_score: 0.3684210526315789,
                ingredient_weightage: 0.1571632216678546,
            },
        ],
    };

export const fitScore: JobApplicationScoreDto = {
    id: 10,
    job_application_id: 'd84cf427-0b99-4d70-b430-a75ee8ae000e',
    percentile: undefined,
    percentile_api_version: undefined,
    percentile_source: undefined,
    score: ScreeningUtils.parseDecimal(
        mockPersonalityFitScoreCalculated.domain_score * 10,
    ),
    score_dimension: 0,
    score_recipe_id: mockPersonalityFitScoreCalculated.job_score_recipe_id,
    score_type: JobApplicationScoreType.ROLE_FIT,
    score_outcome: objectParser.toJSON({
        ingredient_result: mockPersonalityFitScoreCalculated.outcome,
    }),
};
