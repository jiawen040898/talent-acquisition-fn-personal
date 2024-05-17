import {
    JobApplicationScoreType,
    PersonalityOutcomeDomainAlias,
} from '@pulsifi/constants';
import {
    InterestRiasecDto,
    JobApplicationScoreDto,
    OnetOutcomeDto,
    PersonalityOutcomeCalculated,
} from '@pulsifi/dtos';
import { generatorUtil, objectParser } from '@pulsifi/fn';
import { ScreeningUtils } from '@pulsifi/shared';

export const mockWorkStylePayload: OnetOutcomeDto = {
    domain_alias: PersonalityOutcomeDomainAlias.WORK_STYLE,
    domain_score: 0.5244899216618256,
    outcome: [
        {
            domain_id: 54,
            domain_alias: 'achievement_effort',
            domain_score: 1.0,
            traits: [],
            domain_weightage: 0.0589648798521257,
        },
        {
            domain_id: 55,
            domain_alias: 'persistence',
            domain_score: 0.375,
            traits: [],
            domain_weightage: 0.061737523105360445,
        },
        {
            domain_id: 56,
            domain_alias: 'initiative',
            domain_score: 0.7142857142857143,
            traits: [],
            domain_weightage: 0.06025878003696858,
        },
        {
            domain_id: 57,
            domain_alias: 'leadership',
            domain_score: 0.6333333333333333,
            traits: [],
            domain_weightage: 0.05212569316081331,
        },
        {
            domain_id: 58,
            domain_alias: 'cooperation',
            domain_score: 0.25,
            traits: [],
            domain_weightage: 0.06913123844731979,
        },
        {
            domain_id: 59,
            domain_alias: 'concern_for_others',
            domain_score: 0.8333333333333333,
            traits: [],
            domain_weightage: 0.06524953789279113,
        },
        {
            domain_id: 60,
            domain_alias: 'social_orientation',
            domain_score: 0.5,
            traits: [],
            domain_weightage: 0.05563770794824399,
        },
        {
            domain_id: 61,
            domain_alias: 'self_control',
            domain_score: 0.4,
            traits: [],
            domain_weightage: 0.06709796672828097,
        },
        {
            domain_id: 62,
            domain_alias: 'stress_tolerance',
            domain_score: 0.5,
            traits: [],
            domain_weightage: 0.06709796672828097,
        },
        {
            domain_id: 63,
            domain_alias: 'adaptability_flexibility',
            domain_score: 0.5,
            traits: [],
            domain_weightage: 0.06617375231053606,
        },
        {
            domain_id: 64,
            domain_alias: 'dependability',
            domain_score: 0.25,
            traits: [],
            domain_weightage: 0.07412199630314233,
        },
        {
            domain_id: 65,
            domain_alias: 'attention_to_detail',
            domain_score: 0.25,
            traits: [],
            domain_weightage: 0.07615526802218116,
        },
        {
            domain_id: 66,
            domain_alias: 'integrity',
            domain_score: 0.5,
            traits: [],
            domain_weightage: 0.062107208872458415,
        },
        {
            domain_id: 67,
            domain_alias: 'independence',
            domain_score: 0.8333333333333334,
            traits: [],
            domain_weightage: 0.06303142329020334,
        },
        {
            domain_id: 68,
            domain_alias: 'innovation',
            domain_score: 0.8,
            traits: [],
            domain_weightage: 0.0489833641404806,
        },
        {
            domain_id: 69,
            domain_alias: 'analytical_thinking',
            domain_score: 0.25,
            traits: [],
            domain_weightage: 0.05212569316081331,
        },
    ],
    ingredient_weightage: 0.1542824899025897,
};

export const mockWorkValuePayload: OnetOutcomeDto = {
    domain_alias: PersonalityOutcomeDomainAlias.WORK_VALUE,
    domain_score: 0.5003589764641488,
    outcome: [
        {
            domain_id: 48,
            domain_alias: 'achievement',
            domain_score: 0.45436507936507936,
            traits: [],
            domain_weightage: 0.09172413793103448,
        },
        {
            domain_id: 49,
            domain_alias: 'independence',
            domain_score: 0.4293650793650794,
            traits: [],
            domain_weightage: 0.13793103448275865,
        },
        {
            domain_id: 50,
            domain_alias: 'recognition',
            domain_score: 0.475,
            traits: [],
            domain_weightage: 0.09172413793103448,
        },
        {
            domain_id: 51,
            domain_alias: 'relationships',
            domain_score: 0.5549999999999999,
            traits: [],
            domain_weightage: 0.18413793103448275,
        },
        {
            domain_id: 52,
            domain_alias: 'support',
            domain_score: 0.5249999999999999,
            traits: [],
            domain_weightage: 0.3448275862068966,
        },
        {
            domain_id: 53,
            domain_alias: 'working_conditions',
            domain_score: 0.485515873015873,
            traits: [],
            domain_weightage: 0.14965517241379309,
        },
    ],
    ingredient_weightage: 0.0542824899025897,
};

export const mockInterestRiasecPayload: InterestRiasecDto = {
    domain_alias: PersonalityOutcomeDomainAlias.INTEREST_RIASEC,
    domain_score: 0.64286,
    outcome: [
        { domain_alias: 'realistic', domain_score: 0.34375 },
        { domain_alias: 'investigative', domain_score: 0.3125 },
        { domain_alias: 'artistic', domain_score: 0.21875 },
        { domain_alias: 'social', domain_score: 0.28125 },
        { domain_alias: 'enterprising', domain_score: 0.46875 },
        { domain_alias: 'conventional', domain_score: 0.25 },
    ],
    person_codes: ['E', 'R', 'I'],
    job_codes: ['R', 'C', 'I'],
    ingredient_weightage: 0.1542824899025897,
};

export const mockJAPersonalityOutcome: PersonalityOutcomeCalculated = {
    id: generatorUtil.uuid(),
    person_id: generatorUtil.uuid(),
    person_type: 'candidate',
    job_score_recipe_id: '0312047c-9542-4f3b-8d34-5d163fc208c6',
    process_id: 1,
    process_type: 'program',
    work_style: mockWorkStylePayload,
    work_value: mockWorkValuePayload,
    interest_riasec: mockInterestRiasecPayload,
};

export const workStyleJobAppScore: JobApplicationScoreDto = {
    id: 1,
    job_application_id: generatorUtil.uuid(),
    score_recipe_id: mockJAPersonalityOutcome.job_score_recipe_id,
    score_outcome: objectParser.toJSON({
        personality_result: mockWorkStylePayload.outcome,
    }),
    score_type: JobApplicationScoreType.WORK_STYLE,
    score_dimension: 0,
    score: ScreeningUtils.parseDecimal(mockWorkStylePayload.domain_score * 10),
    percentile: undefined,
    percentile_source: undefined,
    percentile_api_version: undefined,
};

export const workValueJobAppScore: JobApplicationScoreDto = {
    id: 2,
    job_application_id: generatorUtil.uuid(),
    score_recipe_id: mockJAPersonalityOutcome.job_score_recipe_id,
    score_outcome: objectParser.toJSON({
        personality_result: mockWorkValuePayload.outcome,
    }),
    score_type: JobApplicationScoreType.WORK_VALUE,
    score_dimension: 0,
    score: ScreeningUtils.parseDecimal(mockWorkValuePayload.domain_score * 10),
    percentile: undefined,
    percentile_source: undefined,
    percentile_api_version: undefined,
};

export const workInterestJobAppScore: JobApplicationScoreDto = {
    id: 3,
    job_application_id: generatorUtil.uuid(),
    score_recipe_id: mockJAPersonalityOutcome.job_score_recipe_id,
    score_outcome: objectParser.toJSON({
        personality_result: mockInterestRiasecPayload.outcome,
        job_codes: mockInterestRiasecPayload.job_codes,
        person_codes: mockInterestRiasecPayload.person_codes,
    }),
    score_type: JobApplicationScoreType.WORK_INTEREST,
    score_dimension: 0,
    score: ScreeningUtils.parseDecimal(
        mockInterestRiasecPayload.domain_score * 10,
    ),
    percentile: undefined,
    percentile_source: undefined,
    percentile_api_version: undefined,
};
