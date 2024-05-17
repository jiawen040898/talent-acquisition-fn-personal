import {
    JobApplicationScoreType,
    PersonalityCognitiveScoreDomainAlias,
} from '@pulsifi/constants';
import {
    CognitiveScoreDto,
    JobApplicationScoreDto,
    PersonalityCognitiveScoresCalculated,
} from '@pulsifi/dtos';
import { generatorUtil, objectParser } from '@pulsifi/fn';
import { ScreeningUtils } from '@pulsifi/shared';

export const mockVerbal: CognitiveScoreDto = {
    domain_alias: PersonalityCognitiveScoreDomainAlias.VERBAL,
    domain_score: 0.6190476190476191,
    domain_percentile: 69,
    ingredient_weightage: 0.19449394155381328,
};

export const mockLogical: CognitiveScoreDto = {
    domain_alias: PersonalityCognitiveScoreDomainAlias.LOGICAL,
    domain_score: 0.125,
    domain_percentile: 10,
    ingredient_weightage: 0.1854953670705631,
};

export const mockNumeric: CognitiveScoreDto = {
    domain_alias: PersonalityCognitiveScoreDomainAlias.NUMERIC,
    domain_score: 0.3684210526315789,
    domain_percentile: 34,
    ingredient_weightage: 0.1571632216678546,
};

export const mockReasoningAvg: CognitiveScoreDto = {
    domain_alias: PersonalityCognitiveScoreDomainAlias.REASONING_AVG,
    domain_score: 0.37082289055973267,
    domain_percentile: 10,
    ingredient_weightage: undefined,
};

export const mockJAPersonalityCognitiveScores: PersonalityCognitiveScoresCalculated =
    {
        id: generatorUtil.uuid(),
        person_id: generatorUtil.uuid(),
        person_type: 'candidate',
        job_score_recipe_id: generatorUtil.uuid(),
        process_id: 1,
        process_type: 'program',
        payload: [mockVerbal, mockLogical, mockNumeric, mockReasoningAvg],
    };

export const verbalScore: JobApplicationScoreDto = {
    id: 6,
    job_application_id: generatorUtil.uuid(),
    score_recipe_id: mockJAPersonalityCognitiveScores.job_score_recipe_id,
    score_outcome: objectParser.toJSON({
        cognitive_result: mockVerbal,
    }),
    score_type: JobApplicationScoreType.REASONING_VERBAL,
    score_dimension: 0,
    score: ScreeningUtils.parseDecimal(mockVerbal.domain_score * 100),
    percentile: mockVerbal.domain_percentile,
    percentile_source: undefined,
    percentile_api_version: undefined,
};

export const logicalScore: JobApplicationScoreDto = {
    id: 7,
    job_application_id: generatorUtil.uuid(),
    score_recipe_id: mockJAPersonalityCognitiveScores.job_score_recipe_id,
    score_outcome: objectParser.toJSON({
        cognitive_result: mockLogical,
    }),
    score_type: JobApplicationScoreType.REASONING_LOGICAL,
    score_dimension: 0,
    score: ScreeningUtils.parseDecimal(mockLogical.domain_score * 100),
    percentile: mockLogical.domain_percentile,
    percentile_source: undefined,
    percentile_api_version: undefined,
};

export const numericScore: JobApplicationScoreDto = {
    id: 8,
    job_application_id: generatorUtil.uuid(),
    score_recipe_id: mockJAPersonalityCognitiveScores.job_score_recipe_id,
    score_outcome: objectParser.toJSON({
        cognitive_result: mockNumeric,
    }),
    score_type: JobApplicationScoreType.REASONING_NUMERIC,
    score_dimension: 0,
    score: ScreeningUtils.parseDecimal(mockNumeric.domain_score * 100),
    percentile: mockNumeric.domain_percentile,
    percentile_source: undefined,
    percentile_api_version: undefined,
};

export const reasoningAvgScore: JobApplicationScoreDto = {
    id: 9,
    job_application_id: generatorUtil.uuid(),
    score_recipe_id: mockJAPersonalityCognitiveScores.job_score_recipe_id,
    score_outcome: objectParser.toJSON({
        cognitive_result: mockReasoningAvg,
    }),
    score_type: JobApplicationScoreType.REASONING_AVG,
    score_dimension: 0,
    score: ScreeningUtils.parseDecimal(mockReasoningAvg.domain_score * 100),
    percentile: mockReasoningAvg.domain_percentile,
    percentile_source: undefined,
    percentile_api_version: undefined,
};
