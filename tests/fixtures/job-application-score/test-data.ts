import {
    JobApplicationScoreType,
    JobApplicationSkillSource,
} from '@pulsifi/constants';
import { JobApplicationScore } from '@pulsifi/models';

const jobApplicationId = '00000000-0000-0000-0000-000000000001';

export const verbalPartialScoreOutput: JobApplicationScore = {
    score: 73.232432,
    score_dimension: 2,
    score_outcome: {
        cognitive_result: {
            domain_alias: 'verbal',
            domain_percentile: null,
            domain_score: 0.73232432,
            ingredient_weightage: null,
        },
    },
    score_type: JobApplicationScoreType.REASONING_VERBAL,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
};

export const logicalPartialScoreOutput: JobApplicationScore = {
    score: 77.832782,
    score_dimension: 2,
    score_outcome: {
        cognitive_result: {
            domain_alias: 'logical',
            domain_percentile: null,
            domain_score: 0.77832782,
            ingredient_weightage: null,
        },
    },
    score_type: JobApplicationScoreType.REASONING_LOGICAL,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
};

export const numericPartialScoreOutput: JobApplicationScore = {
    score: 33.7397,
    score_dimension: 1,
    score_outcome: {
        cognitive_result: {
            domain_alias: 'numeric',
            domain_percentile: null,
            domain_score: 0.337397,
            ingredient_weightage: null,
        },
    },
    score_type: JobApplicationScoreType.REASONING_NUMERIC,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
};

export const reasoningAveragePartialScoreOutput: JobApplicationScore = {
    score: 1.1246567,
    score_dimension: 0,
    score_outcome: {
        cognitive_result: {
            domain_alias: 'reasoning_average',
            domain_percentile: null,
            domain_score: 0.11246566666666667,
            ingredient_weightage: null,
        },
    },
    score_type: JobApplicationScoreType.REASONING_AVG,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
};

export const mockGetCognitiveScoreOutput: JobApplicationScore[] = [
    verbalPartialScoreOutput,
    logicalPartialScoreOutput,
    numericPartialScoreOutput,
    reasoningAveragePartialScoreOutput,
];

export const workStylePartialScoreOutput: JobApplicationScore = {
    score: 6.010443,
    score_dimension: 1,
    score_outcome: {
        personality_result: [
            {
                domain_alias: 'achievement_effort',
                domain_score: 0.8229166666666666,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'persistence',
                domain_score: 0.5625,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'initiative',
                domain_score: 0.7232142857142857,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'leadership',
                domain_score: 0.5416666666666666,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'cooperation',
                domain_score: 0.5,
                domain_weightage: 0.033333333,
                traits: [],
            },
            {
                domain_alias: 'concern_for_others',
                domain_score: 0.6666666666666667,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'social_orientation',
                domain_score: 0.5104166666666666,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'self_control',
                domain_score: 0.5125,
                domain_weightage: 0.033333333,
                traits: [],
            },
            {
                domain_alias: 'stress_tolerance',
                domain_score: 0.625,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'adaptability_flexibility',
                domain_score: 0.6796875,
                domain_weightage: 0.1,
                traits: [],
            },
            {
                domain_alias: 'dependability',
                domain_score: 0.625,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'attention_to_detail',
                domain_score: 0.4375,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'integrity',
                domain_score: 0.5833333333333334,
                domain_weightage: 0.1,
                traits: [],
            },
            {
                domain_alias: 'independence',
                domain_score: 0.6145833333333334,
                domain_weightage: 0,
                traits: [],
            },
            {
                domain_alias: 'innovation',
                domain_score: 0.6625,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'analytical_thinking',
                domain_score: 0.4375,
                domain_weightage: 0.066666667,
                traits: [],
            },
        ],
    },
    score_type: JobApplicationScoreType.WORK_STYLE,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
};

export const workInterestPartialScoreOutput: JobApplicationScore = {
    score: 5.7143,
    score_dimension: 1,
    score_outcome: {
        job_codes: ['I', 'C', 'E'],
        person_codes: [
            ['R', 'I', 'E'],
            ['R', 'E', 'I'],
            ['I', 'R', 'E'],
            ['I', 'E', 'R'],
            ['E', 'R', 'I'],
            ['E', 'I', 'R'],
        ],
        personality_result: [
            {
                domain_alias: 'realistic',
                domain_score: 0.71875,
            },
            {
                domain_alias: 'investigative',
                domain_score: 0.71875,
            },
            {
                domain_alias: 'artistic',
                domain_score: 0.46875,
            },
            {
                domain_alias: 'social',
                domain_score: 0.625,
            },
            {
                domain_alias: 'enterprising',
                domain_score: 0.71875,
            },
            {
                domain_alias: 'conventional',
                domain_score: 0.53125,
            },
        ],
    },
    score_type: JobApplicationScoreType.WORK_INTEREST,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
};

export const workValuePartialScoreOutput: JobApplicationScore = {
    score: 5.204422,
    score_dimension: 1,
    score_outcome: {
        personality_result: [
            {
                domain_alias: 'achievement',
                domain_score: 0.6071428571428571,
                domain_weightage: 0.285714286,
                traits: [],
            },
            {
                domain_alias: 'working_conditions',
                domain_score: 0.49523809523809526,
                domain_weightage: 0,
                traits: [],
            },
            {
                domain_alias: 'recognition',
                domain_score: 0.4083333333333334,
                domain_weightage: 0,
                traits: [],
            },
            {
                domain_alias: 'relationships',
                domain_score: 0.49833333333333335,
                domain_weightage: 0.285714286,
                traits: [],
            },
            {
                domain_alias: 'support',
                domain_score: 0.49166666666666664,
                domain_weightage: 0.285714286,
                traits: [],
            },
            {
                domain_alias: 'independence',
                domain_score: 0.4488095238095238,
                domain_weightage: 0.142857143,
                traits: [],
            },
        ],
    },
    score_type: JobApplicationScoreType.WORK_VALUE,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
};

export const mockGetPersonalityScoreOutput: JobApplicationScore[] = [
    workStylePartialScoreOutput,
    workInterestPartialScoreOutput,
    workValuePartialScoreOutput,
];

export const workExperiencePartialScoreOutput: JobApplicationScore = {
    score: 8,
    score_dimension: 2,
    score_outcome: {
        pairwise_result: [
            {
                matches: [
                    {
                        job_title: 'Python',
                        score: 0.7,
                    },
                    {
                        job_title: 'Typescript',
                        score: 0.9,
                    },
                ],
                previous_employment: 'Javascript',
            },
        ],
    },
    score_type: JobApplicationScoreType.WORK_EXP,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
};

export const hardSkillPartialScoreOutput: JobApplicationScore = {
    score: 8,
    score_dimension: 2,
    score_outcome: {
        pairwise_result: [
            {
                matches: [
                    {
                        match: false,
                        score: 0.7,
                        skill_name: 'Python',
                        source: JobApplicationSkillSource.DAXTRA,
                    },
                    {
                        match: true,
                        score: 0.9,
                        skill_name: 'Typescript',
                        source: JobApplicationSkillSource.DAXTRA,
                    },
                ],
                skill_name: 'Javascript',
            },
        ],
    },
    score_type: JobApplicationScoreType.HARD_SKILL,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
};

export const mockGetRoleFitPartialScoreOutput: JobApplicationScore = {
    score: 4.428627,
    score_dimension: 1,
    score_outcome: {
        ingredient_result: [
            {
                ingredient_alias: 'work_style',
                ingredient_score: 0.6010443000000001,
                ingredient_weightage: 0.25,
                display_score_rounding_adjustment: 0,
                display_weightage_rounding_adjustment: 0,
            },
            {
                ingredient_alias: 'work_value',
                ingredient_score: 0.5204422,
                ingredient_weightage: 0.25,
                display_score_rounding_adjustment: 0,
                display_weightage_rounding_adjustment: 0,
            },
            {
                ingredient_alias: 'interest_riasec',
                ingredient_score: 0.57143,
                ingredient_weightage: 0.25,
                display_score_rounding_adjustment: 0,
                display_weightage_rounding_adjustment: 0,
            },
            {
                ingredient_alias: 'reasoning_verbal',
                ingredient_score: 0.073232432,
                ingredient_weightage: 0.083333333,
                display_score_rounding_adjustment: -0.01,
                display_weightage_rounding_adjustment: 0.01,
            },
            {
                ingredient_alias: 'reasoning_numeric',
                ingredient_score: 0.08453762684000002,
                ingredient_weightage: 0.083333333,
                display_score_rounding_adjustment: 0,
                display_weightage_rounding_adjustment: 0,
            },
            {
                ingredient_alias: 'reasoning_logical',
                ingredient_score: 0.077832782,
                ingredient_weightage: 0.083333333,
                display_score_rounding_adjustment: 0,
                display_weightage_rounding_adjustment: 0,
            },
        ],
    },
    score_type: JobApplicationScoreType.ROLE_FIT,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
};

export const getCultureFitPartialScoreOutput: JobApplicationScore = {
    score: 2.8629212500000003,
    score_dimension: 0,
    score_outcome: {
        framework_alias: null,
        personality_result: [
            {
                domain_alias: 'work_style',
                domain_score: 0.6010443,
                domain_weightage: 0.25,
                traits: [
                    {
                        trait_alias: 'achievement_effort',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.8229166666666666,
                        trait_weightage: 0.066666667,
                    },
                    {
                        trait_alias: 'persistence',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.5625,
                        trait_weightage: 0.066666667,
                    },
                    {
                        trait_alias: 'initiative',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.7232142857142857,
                        trait_weightage: 0.066666667,
                    },
                    {
                        trait_alias: 'leadership',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.5416666666666666,
                        trait_weightage: 0.066666667,
                    },
                    {
                        trait_alias: 'cooperation',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.5,
                        trait_weightage: 0.033333333,
                    },
                    {
                        trait_alias: 'concern_for_others',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.6666666666666667,
                        trait_weightage: 0.066666667,
                    },
                    {
                        trait_alias: 'social_orientation',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.5104166666666666,
                        trait_weightage: 0.066666667,
                    },
                    {
                        trait_alias: 'self_control',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.5125,
                        trait_weightage: 0.033333333,
                    },
                    {
                        trait_alias: 'stress_tolerance',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.625,
                        trait_weightage: 0.066666667,
                    },
                    {
                        trait_alias: 'adaptability_flexibility',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.6796875,
                        trait_weightage: 0.1,
                    },
                    {
                        trait_alias: 'dependability',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.625,
                        trait_weightage: 0.066666667,
                    },
                    {
                        trait_alias: 'attention_to_detail',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.4375,
                        trait_weightage: 0.066666667,
                    },
                    {
                        trait_alias: 'integrity',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.5833333333333334,
                        trait_weightage: 0.1,
                    },
                    {
                        trait_alias: 'independence',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.6145833333333334,
                        trait_weightage: 0,
                    },
                    {
                        trait_alias: 'innovation',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.6625,
                        trait_weightage: 0.066666667,
                    },
                    {
                        trait_alias: 'analytical_thinking',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.4375,
                        trait_weightage: 0.066666667,
                    },
                ],
            },
            {
                domain_alias: 'work_value',
                domain_score: 0.5441242,
                domain_weightage: 0.25,
                traits: [
                    {
                        trait_alias: 'achievement',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.6071428571428571,
                        trait_weightage: 0.285714286,
                    },
                    {
                        trait_alias: 'working_conditions',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.49523809523809526,
                        trait_weightage: 0,
                    },
                    {
                        trait_alias: 'recognition',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.4083333333333334,
                        trait_weightage: 0,
                    },
                    {
                        trait_alias: 'relationships',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.49833333333333335,
                        trait_weightage: 0.285714286,
                    },
                    {
                        trait_alias: 'support',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.49166666666666664,
                        trait_weightage: 0.285714286,
                    },
                    {
                        trait_alias: 'independence',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.6145833333333334,
                        trait_weightage: 0.142857143,
                    },
                ],
            },
        ],
    },
    score_type: JobApplicationScoreType.CULTURE_FIT,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: 'a806101e-3710-4d79-b854-bf3820c9d585',
};

export const workStyleScore: JobApplicationScore = {
    created_by: 26182,
    updated_by: 26182,
    created_at: new Date('2024-03-13T01:31:56.618Z'),
    updated_at: new Date('2024-03-13T01:31:56.618Z'),
    id: 113068,
    job_application_id: 'f13ee826-ea05-4689-917d-8e43d25d5379',
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
    score_outcome: {
        personality_result: [
            {
                domain_alias: 'achievement_effort',
                domain_score: 0.8229166666666666,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'persistence',
                domain_score: 0.5625,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'initiative',
                domain_score: 0.7232142857142857,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'leadership',
                domain_score: 0.5416666666666666,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'cooperation',
                domain_score: 0.5,
                domain_weightage: 0.033333333,
                traits: [],
            },
            {
                domain_alias: 'concern_for_others',
                domain_score: 0.6666666666666667,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'social_orientation',
                domain_score: 0.5104166666666666,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'self_control',
                domain_score: 0.5125,
                domain_weightage: 0.033333333,
                traits: [],
            },
            {
                domain_alias: 'stress_tolerance',
                domain_score: 0.625,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'adaptability_flexibility',
                domain_score: 0.6796875,
                domain_weightage: 0.1,
                traits: [],
            },
            {
                domain_alias: 'dependability',
                domain_score: 0.625,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'attention_to_detail',
                domain_score: 0.4375,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'integrity',
                domain_score: 0.5833333333333334,
                domain_weightage: 0.1,
                traits: [],
            },
            {
                domain_alias: 'independence',
                domain_score: 0.6145833333333334,
                domain_weightage: 0,
                traits: [],
            },
            {
                domain_alias: 'innovation',
                domain_score: 0.6625,
                domain_weightage: 0.066666667,
                traits: [],
            },
            {
                domain_alias: 'analytical_thinking',
                domain_score: 0.4375,
                domain_weightage: 0.066666667,
                traits: [],
            },
        ],
    },
    score_type: 'work_style' as JobApplicationScoreType,
    score_dimension: 1,
    score: 6.010443,
};

export const workValuesScore: JobApplicationScore = {
    created_by: 26182,
    updated_by: 26182,
    created_at: new Date('2024-03-13T01:31:56.618Z'),
    updated_at: new Date('2024-03-13T01:31:56.618Z'),
    id: 113070,
    job_application_id: 'f13ee826-ea05-4689-917d-8e43d25d5379',
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
    score_outcome: {
        personality_result: [
            {
                domain_alias: 'achievement',
                domain_score: 0.6071428571428571,
                domain_weightage: 0.285714286,
                traits: [],
            },
            {
                domain_alias: 'working_conditions',
                domain_score: 0.49523809523809526,
                domain_weightage: 0,
                traits: [],
            },
            {
                domain_alias: 'recognition',
                domain_score: 0.4083333333333334,
                domain_weightage: 0,
                traits: [],
            },
            {
                domain_alias: 'relationships',
                domain_score: 0.49833333333333335,
                domain_weightage: 0.285714286,
                traits: [],
            },
            {
                domain_alias: 'support',
                domain_score: 0.49166666666666664,
                domain_weightage: 0.285714286,
                traits: [],
            },
            {
                domain_alias: 'independence',
                domain_score: 0.4488095238095238,
                domain_weightage: 0.142857143,
                traits: [],
            },
        ],
    },
    score_type: 'work_value' as JobApplicationScoreType,
    score_dimension: 1,
    score: 5.204422,
};

export const reasoningVerbalScore: JobApplicationScore = {
    created_by: 26182,
    updated_by: 26182,
    created_at: new Date('2024-03-13T01:31:56.618Z'),
    updated_at: new Date('2024-03-13T01:31:56.618Z'),
    id: 113071,
    job_application_id: 'f13ee826-ea05-4689-917d-8e43d25d5379',
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
    score_outcome: {
        cognitive_result: {
            domain_score: 0.73232432,
            domain_alias: 'verbal',
            domain_percentile: null,
            ingredient_weightage: null,
        },
    },
    score_type: 'reasoning_verbal' as JobApplicationScoreType,
    score_dimension: 2,
    score: 73.232432,
};

export const reasoningLogicalScore: JobApplicationScore = {
    created_by: 26182,
    updated_by: 26182,
    created_at: new Date('2024-03-13T01:31:56.618Z'),
    updated_at: new Date('2024-03-13T01:31:56.618Z'),
    id: 113072,
    job_application_id: 'f13ee826-ea05-4689-917d-8e43d25d5379',
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
    score_outcome: {
        cognitive_result: {
            domain_score: 0.77832782,
            domain_alias: 'logical',
            domain_percentile: null,
            ingredient_weightage: null,
        },
    },
    score_type: 'reasoning_logical' as JobApplicationScoreType,
    score_dimension: 2,
    score: 77.832782,
};

export const reasoningNumericalScore: JobApplicationScore = {
    created_by: 26182,
    updated_by: 26182,
    created_at: new Date('2024-03-13T01:31:56.618Z'),
    updated_at: new Date('2024-03-13T01:31:56.618Z'),
    id: 113073,
    job_application_id: 'f13ee826-ea05-4689-917d-8e43d25d5379',
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
    score_outcome: {
        cognitive_result: {
            domain_score: 0.8453762684,
            domain_alias: 'numeric',
            domain_percentile: null,
            ingredient_weightage: null,
        },
    },
    score_type: 'reasoning_numeric' as JobApplicationScoreType,
    score_dimension: 2,
    score: 84.53762684,
};

export const workInterestScore: JobApplicationScore = {
    created_by: 26182,
    updated_by: 26182,
    created_at: new Date('2024-03-13T01:31:56.618Z'),
    updated_at: new Date('2024-03-13T01:31:56.618Z'),
    id: 113069,
    job_application_id: 'f13ee826-ea05-4689-917d-8e43d25d5379',
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
    score_outcome: {
        person_codes: [
            ['R', 'I', 'E'],
            ['R', 'E', 'I'],
            ['I', 'R', 'E'],
            ['I', 'E', 'R'],
            ['E', 'R', 'I'],
            ['E', 'I', 'R'],
        ],
        job_codes: ['I', 'C', 'E'],
        personality_result: [
            {
                domain_alias: 'realistic',
                domain_score: 0.71875,
            },
            {
                domain_alias: 'investigative',
                domain_score: 0.71875,
            },
            {
                domain_alias: 'artistic',
                domain_score: 0.46875,
            },
            {
                domain_alias: 'social',
                domain_score: 0.625,
            },
            {
                domain_alias: 'enterprising',
                domain_score: 0.71875,
            },
            {
                domain_alias: 'conventional',
                domain_score: 0.53125,
            },
        ],
    },
    score_type: 'work_interest' as JobApplicationScoreType,
    score_dimension: 1,
    score: 5.7143,
};

export const workExperienceScore: JobApplicationScore = {
    ...workExperiencePartialScoreOutput,
    created_by: 26182,
    updated_by: 26182,
    created_at: new Date('2024-03-13T01:31:56.618Z'),
    updated_at: new Date('2024-03-13T01:31:56.618Z'),
    id: 114069,
    job_application_id: 'f13ee826-ea05-4689-917d-8e43d25d5379',
};

export const hardSkillScore: JobApplicationScore = {
    ...hardSkillPartialScoreOutput,
    created_by: 26182,
    updated_by: 26182,
    created_at: new Date('2024-03-13T01:31:56.618Z'),
    updated_at: new Date('2024-03-13T01:31:56.618Z'),
    id: 114070,
    job_application_id: 'f13ee826-ea05-4689-917d-8e43d25d5379',
};

export const allCompletedNonFitScores = [
    workStyleScore,
    workValuesScore,
    workInterestScore,
    workExperienceScore,
    reasoningVerbalScore,
    reasoningLogicalScore,
    reasoningNumericalScore,
    hardSkillScore,
];

export const mockGetHardSkillJobApplicationScoreOutput: JobApplicationScore = {
    score: 8,
    score_dimension: 2,
    score_outcome: {
        pairwise_result: [
            {
                matches: [
                    {
                        match: false,
                        score: 0.7,
                        skill_name: 'Python',
                        source: JobApplicationSkillSource.DAXTRA,
                    },
                    {
                        match: true,
                        score: 0.9,
                        skill_name: 'Typescript',
                        source: JobApplicationSkillSource.DAXTRA,
                    },
                ],
                skill_name: 'Javascript',
            },
        ],
    },
    score_type: JobApplicationScoreType.HARD_SKILL,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
};

export const mockGetWorkExpJobApplicationScoreOutput = {
    score: 8,
    score_dimension: 2,
    score_outcome: {
        pairwise_result: [
            {
                matches: [
                    {
                        job_title: 'Technical Assistant',
                        score: 0.7,
                    },
                    {
                        job_title: 'Software Developer',
                        score: 0.9,
                    },
                ],
                previous_employment: 'Javascript Developer',
            },
        ],
    },
    score_type: JobApplicationScoreType.WORK_EXP,
    job_application_id: jobApplicationId,
    updated_by: 5,
    created_by: 5,
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
};

export const mockRoleFitScore: JobApplicationScore = {
    created_by: 5,
    job_application_id: '00000000-0000-0000-0000-000000000001',
    score: 9.999,
    score_dimension: 1,
    score_outcome: {
        ingredient_result: [
            {
                ingredient_alias: 'work_style',
                ingredient_score: 0.6010443000000001,
                ingredient_weightage: 0.25,
                display_score_rounding_adjustment: 0,
                display_weightage_rounding_adjustment: 0,
            },
            {
                ingredient_alias: 'work_value',
                ingredient_score: 0.5204422,
                ingredient_weightage: 0.25,
                display_score_rounding_adjustment: 0,
                display_weightage_rounding_adjustment: 0,
            },
            {
                ingredient_alias: 'interest_riasec',
                ingredient_score: 0.57143,
                ingredient_weightage: 0.25,
                display_score_rounding_adjustment: 0,
                display_weightage_rounding_adjustment: 0,
            },
            {
                ingredient_alias: 'reasoning_verbal',
                ingredient_score: 0.073232432,
                ingredient_weightage: 0.083333333,
                display_score_rounding_adjustment: -0.01,
                display_weightage_rounding_adjustment: 0.01,
            },
            {
                ingredient_alias: 'reasoning_numeric',
                ingredient_score: 0.08453762684000002,
                ingredient_weightage: 0.083333333,
                display_score_rounding_adjustment: 0,
                display_weightage_rounding_adjustment: 0,
            },
            {
                ingredient_alias: 'reasoning_logical',
                ingredient_score: 0.077832782,
                ingredient_weightage: 0.083333333,
                display_score_rounding_adjustment: 0,
                display_weightage_rounding_adjustment: 0,
            },
        ],
    },
    score_recipe_id: '106e0b1d-02c4-4321-9dac-9768f84f8bc1',
    score_type: JobApplicationScoreType.ROLE_FIT,
    updated_by: 5,
};

export const mockCultureFitScore: JobApplicationScore = {
    created_by: 5,
    job_application_id: '00000000-0000-0000-0000-000000000001',
    score: 9.999,
    score_dimension: 1,
    score_outcome: {
        framework_alias: 'polaris',
        personality_result: [
            {
                domain_alias: 'people_centric',
                domain_score: 0.5587499,
                domain_weightage: 0.125,
                traits: [
                    {
                        trait_alias: 'social',
                        trait_framework: 'work_interest',
                        trait_score: 0.625,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'support',
                        trait_framework: 'work_value',
                        trait_score: 0.49166666666666664,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'cooperation',
                        trait_framework: 'work_style',
                        trait_score: 0.5,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'concern_for_others',
                        trait_framework: 'work_style',
                        trait_score: 0.6666666666666667,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'social_orientation',
                        trait_framework: 'work_style',
                        trait_score: 0.5104166666666666,
                        trait_weightage: 0.2,
                    },
                ],
            },
            {
                domain_alias: 'ownership',
                domain_score: 0.5581786,
                domain_weightage: 0.125,
                traits: [
                    {
                        trait_alias: 'investigative',
                        trait_framework: 'work_interest',
                        trait_score: 0.71875,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'independence',
                        trait_framework: 'work_value',
                        trait_score: 0.4488095238095238,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'relationships',
                        trait_framework: 'work_value',
                        trait_score: 0.49833333333333335,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'leadership',
                        trait_framework: 'work_style',
                        trait_score: 0.5416666666666666,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'integrity',
                        trait_framework: 'work_style',
                        trait_score: 0.5833333333333334,
                        trait_weightage: 0.2,
                    },
                ],
            },
            {
                domain_alias: 'learning',
                domain_score: 0.6639881000000001,
                domain_weightage: 0.125,
                traits: [
                    {
                        trait_alias: 'working_conditions',
                        trait_framework: 'work_value',
                        trait_score: 0.49523809523809526,
                        trait_weightage: 0.25,
                    },
                    {
                        trait_alias: 'achievement_effort',
                        trait_framework: 'work_style',
                        trait_score: 0.8229166666666666,
                        trait_weightage: 0.25,
                    },
                    {
                        trait_alias: 'initiative',
                        trait_framework: 'work_style',
                        trait_score: 0.7232142857142857,
                        trait_weightage: 0.25,
                    },
                    {
                        trait_alias: 'independence',
                        trait_framework: 'work_style',
                        trait_score: 0.6145833333333334,
                        trait_weightage: 0.25,
                    },
                ],
            },
            {
                domain_alias: 'avant_garde',
                domain_score: 0.6029731,
                domain_weightage: 0.125,
                traits: [
                    {
                        trait_alias: 'realistic',
                        trait_framework: 'work_interest',
                        trait_score: 0.71875,
                        trait_weightage: 0.1428571,
                    },
                    {
                        trait_alias: 'reasoning_logical',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.77832782,
                        trait_weightage: 0.1428571,
                    },
                    {
                        trait_alias: 'independence',
                        trait_framework: 'work_value',
                        trait_score: 0.4488095238095238,
                        trait_weightage: 0.1428571,
                    },
                    {
                        trait_alias: 'working_conditions',
                        trait_framework: 'work_value',
                        trait_score: 0.49523809523809526,
                        trait_weightage: 0.1428571,
                    },
                    {
                        trait_alias: 'adaptability_flexibility',
                        trait_framework: 'work_style',
                        trait_score: 0.6796875,
                        trait_weightage: 0.1428571,
                    },
                    {
                        trait_alias: 'innovation',
                        trait_framework: 'work_style',
                        trait_score: 0.6625,
                        trait_weightage: 0.1428571,
                    },
                    {
                        trait_alias: 'analytical_thinking',
                        trait_framework: 'work_style',
                        trait_score: 0.4375,
                        trait_weightage: 0.1428571,
                    },
                ],
            },
            {
                domain_alias: 'results_driven',
                domain_score: 0.6051785999999999,
                domain_weightage: 0.125,
                traits: [
                    {
                        trait_alias: 'achievement',
                        trait_framework: 'work_value',
                        trait_score: 0.6071428571428571,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'recognition',
                        trait_framework: 'work_value',
                        trait_score: 0.4083333333333334,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'achievement_effort',
                        trait_framework: 'work_style',
                        trait_score: 0.8229166666666666,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'persistence',
                        trait_framework: 'work_style',
                        trait_score: 0.5625,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'dependability',
                        trait_framework: 'work_style',
                        trait_score: 0.625,
                        trait_weightage: 0.2,
                    },
                ],
            },
            {
                domain_alias: 'in_sync',
                domain_score: 0.5739584,
                domain_weightage: 0.125,
                traits: [
                    {
                        trait_alias: 'support',
                        trait_framework: 'work_value',
                        trait_score: 0.49166666666666664,
                        trait_weightage: 0.25,
                    },
                    {
                        trait_alias: 'concern_for_others',
                        trait_framework: 'work_style',
                        trait_score: 0.6666666666666667,
                        trait_weightage: 0.25,
                    },
                    {
                        trait_alias: 'self_control',
                        trait_framework: 'work_style',
                        trait_score: 0.5125,
                        trait_weightage: 0.25,
                    },
                    {
                        trait_alias: 'stress_tolerance',
                        trait_framework: 'work_style',
                        trait_score: 0.625,
                        trait_weightage: 0.25,
                    },
                ],
            },
            {
                domain_alias: 'stakeholder_savvy',
                domain_score: 0.5563333,
                domain_weightage: 0.125,
                traits: [
                    {
                        trait_alias: 'enterprising',
                        trait_framework: 'work_interest',
                        trait_score: 0.71875,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'relationships',
                        trait_framework: 'work_value',
                        trait_score: 0.49833333333333335,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'leadership',
                        trait_framework: 'work_style',
                        trait_score: 0.5416666666666666,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'social_orientation',
                        trait_framework: 'work_style',
                        trait_score: 0.5104166666666666,
                        trait_weightage: 0.2,
                    },
                    {
                        trait_alias: 'self_control',
                        trait_framework: 'work_style',
                        trait_score: 0.5125,
                        trait_weightage: 0.2,
                    },
                ],
            },
            {
                domain_alias: 'plus',
                domain_score: 0.785335,
                domain_weightage: 0.125,
                traits: [
                    {
                        trait_alias: 'reasoning_verbal',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.73232432,
                        trait_weightage: 0.33333,
                    },
                    {
                        trait_alias: 'reasoning_logical',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.77832782,
                        trait_weightage: 0.33333,
                    },
                    {
                        trait_alias: 'reasoning_numeric',
                        trait_framework: 'pulsifi_default',
                        trait_score: 0.8453762684,
                        trait_weightage: 0.33333,
                    },
                ],
            },
        ],
    },
    score_recipe_id: 'a806101e-3710-4d79-b854-bf3820c9d585',
    score_type: JobApplicationScoreType.CULTURE_FIT,
    updated_by: 5,
};
