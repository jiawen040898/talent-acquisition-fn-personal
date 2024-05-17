import { JobApplicationQuestionnaire } from '@pulsifi/models';
import { TestData, testUtil } from '@pulsifi/tests/setup';
import * as Factory from 'factory.ts';

export const testJobApplicationQuestionnaireBuilder =
    Factory.Sync.makeFactory<JobApplicationQuestionnaire>({
        id: Factory.each((i) => i),
        job_application_id: Factory.each((i) => testUtil.mockUuid(i + 1)),
        questionnaire_framework: 'personality',
        questionnaire_id: 30,
        started_at: new Date('2024-02-29T04:44:52.191Z'),
        completed_at: new Date('2024-02-29T04:45:02.667Z'),
        attempts: 1,
        question_answer_raw: {
            answers: [
                {
                    question_code: 2,
                    score: 2,
                    answer_at: '2024-02-29T04:44:54.476Z',
                },
                {
                    question_code: 135,
                    score: 3,
                    answer_at: '2024-02-29T04:44:54.505Z',
                },
                {
                    question_code: 60,
                    score: 4,
                    answer_at: '2024-02-29T04:44:54.646Z',
                },
                {
                    question_code: 49,
                    score: 2,
                    answer_at: '2024-02-29T04:44:54.762Z',
                },
                {
                    question_code: 154,
                    score: 3,
                    answer_at: '2024-02-29T04:44:54.803Z',
                },
                {
                    question_code: 19,
                    score: 4,
                    answer_at: '2024-02-29T04:44:54.935Z',
                },
                {
                    question_code: 68,
                    score: 1,
                    answer_at: '2024-02-29T04:44:55.034Z',
                },
                {
                    question_code: 105,
                    score: 2,
                    answer_at: '2024-02-29T04:44:55.035Z',
                },
                {
                    question_code: 63,
                    score: 3,
                    answer_at: '2024-02-29T04:44:55.085Z',
                },
                {
                    question_code: 7,
                    score: 4,
                    answer_at: '2024-02-29T04:44:55.170Z',
                },
                {
                    question_code: 25,
                    score: 2,
                    answer_at: '2024-02-29T04:44:55.294Z',
                },
                {
                    question_code: 142,
                    score: 4,
                    answer_at: '2024-02-29T04:44:55.387Z',
                },
                {
                    question_code: 30,
                    score: 2,
                    answer_at: '2024-02-29T04:44:55.493Z',
                },
                {
                    question_code: 23,
                    score: 1,
                    answer_at: '2024-02-29T04:44:55.506Z',
                },
                {
                    question_code: 21,
                    score: 3,
                    answer_at: '2024-02-29T04:44:55.566Z',
                },
                {
                    question_code: 84,
                    score: 4,
                    answer_at: '2024-02-29T04:44:55.642Z',
                },
                {
                    question_code: 10,
                    score: 1,
                    answer_at: '2024-02-29T04:44:55.771Z',
                },
                {
                    question_code: 118,
                    score: 2,
                    answer_at: '2024-02-29T04:44:55.783Z',
                },
                {
                    question_code: 103,
                    score: 3,
                    answer_at: '2024-02-29T04:44:55.842Z',
                },
                {
                    question_code: 94,
                    score: 4,
                    answer_at: '2024-02-29T04:44:55.938Z',
                },
                {
                    question_code: 55,
                    score: 1,
                    answer_at: '2024-02-29T04:44:56.204Z',
                },
                {
                    question_code: 48,
                    score: 2,
                    answer_at: '2024-02-29T04:44:56.221Z',
                },
                {
                    question_code: 34,
                    score: 3,
                    answer_at: '2024-02-29T04:44:56.260Z',
                },
                {
                    question_code: 148,
                    score: 4,
                    answer_at: '2024-02-29T04:44:56.350Z',
                },
                {
                    question_code: 120,
                    score: 1,
                    answer_at: '2024-02-29T04:44:56.461Z',
                },
                {
                    question_code: 76,
                    score: 2,
                    answer_at: '2024-02-29T04:44:56.484Z',
                },
                {
                    question_code: 54,
                    score: 3,
                    answer_at: '2024-02-29T04:44:56.528Z',
                },
                {
                    question_code: 165,
                    score: 4,
                    answer_at: '2024-02-29T04:44:56.576Z',
                },
                {
                    question_code: 89,
                    score: 1,
                    answer_at: '2024-02-29T04:44:56.692Z',
                },
                {
                    question_code: 152,
                    score: 3,
                    answer_at: '2024-02-29T04:44:56.721Z',
                },
                {
                    question_code: 144,
                    score: 4,
                    answer_at: '2024-02-29T04:44:56.817Z',
                },
                {
                    question_code: 50,
                    score: 2,
                    answer_at: '2024-02-29T04:44:56.944Z',
                },
                {
                    question_code: 5,
                    score: 3,
                    answer_at: '2024-02-29T04:44:56.976Z',
                },
                {
                    question_code: 53,
                    score: 4,
                    answer_at: '2024-02-29T04:44:57.044Z',
                },
                {
                    question_code: 77,
                    score: 1,
                    answer_at: '2024-02-29T04:44:57.185Z',
                },
                {
                    question_code: 93,
                    score: 2,
                    answer_at: '2024-02-29T04:44:57.188Z',
                },
                {
                    question_code: 82,
                    score: 3,
                    answer_at: '2024-02-29T04:44:57.190Z',
                },
                {
                    question_code: 140,
                    score: 4,
                    answer_at: '2024-02-29T04:44:57.317Z',
                },
                {
                    question_code: 79,
                    score: 1,
                    answer_at: '2024-02-29T04:44:57.409Z',
                },
                {
                    question_code: 26,
                    score: 2,
                    answer_at: '2024-02-29T04:44:57.420Z',
                },
                {
                    question_code: 12,
                    score: 3,
                    answer_at: '2024-02-29T04:44:57.452Z',
                },
                {
                    question_code: 133,
                    score: 4,
                    answer_at: '2024-02-29T04:44:57.559Z',
                },
                {
                    question_code: 151,
                    score: 1,
                    answer_at: '2024-02-29T04:44:57.667Z',
                },
                {
                    question_code: 33,
                    score: 2,
                    answer_at: '2024-02-29T04:44:57.680Z',
                },
                {
                    question_code: 87,
                    score: 3,
                    answer_at: '2024-02-29T04:44:57.701Z',
                },
                {
                    question_code: 61,
                    score: 4,
                    answer_at: '2024-02-29T04:44:57.801Z',
                },
                {
                    question_code: 113,
                    score: 1,
                    answer_at: '2024-02-29T04:44:57.912Z',
                },
                {
                    question_code: 125,
                    score: 2,
                    answer_at: '2024-02-29T04:44:57.928Z',
                },
                {
                    question_code: 78,
                    score: 3,
                    answer_at: '2024-02-29T04:44:57.953Z',
                },
                {
                    question_code: 41,
                    score: 4,
                    answer_at: '2024-02-29T04:44:58.044Z',
                },
                {
                    question_code: 172,
                    score: 1,
                    answer_at: '2024-02-29T04:44:58.136Z',
                },
                {
                    question_code: 123,
                    score: 2,
                    answer_at: '2024-02-29T04:44:58.143Z',
                },
                {
                    question_code: 47,
                    score: 3,
                    answer_at: '2024-02-29T04:44:58.168Z',
                },
                {
                    question_code: 81,
                    score: 4,
                    answer_at: '2024-02-29T04:44:58.250Z',
                },
                {
                    question_code: 58,
                    score: 1,
                    answer_at: '2024-02-29T04:44:58.345Z',
                },
                {
                    question_code: 136,
                    score: 2,
                    answer_at: '2024-02-29T04:44:58.346Z',
                },
                {
                    question_code: 131,
                    score: 3,
                    answer_at: '2024-02-29T04:44:58.376Z',
                },
                {
                    question_code: 74,
                    score: 4,
                    answer_at: '2024-02-29T04:44:58.445Z',
                },
                {
                    question_code: 15,
                    score: 1,
                    answer_at: '2024-02-29T04:44:58.533Z',
                },
                {
                    question_code: 66,
                    score: 2,
                    answer_at: '2024-02-29T04:44:58.537Z',
                },
                {
                    question_code: 98,
                    score: 4,
                    answer_at: '2024-02-29T04:44:58.652Z',
                },
                {
                    question_code: 39,
                    score: 2,
                    answer_at: '2024-02-29T04:44:58.720Z',
                },
                {
                    question_code: 101,
                    score: 1,
                    answer_at: '2024-02-29T04:44:58.728Z',
                },
                {
                    question_code: 69,
                    score: 3,
                    answer_at: '2024-02-29T04:44:58.749Z',
                },
                {
                    question_code: 86,
                    score: 3,
                    answer_at: '2024-02-29T04:44:59.791Z',
                },
                {
                    question_code: 110,
                    score: 4,
                    answer_at: '2024-02-29T04:44:59.830Z',
                },
                {
                    question_code: 56,
                    score: 1,
                    answer_at: '2024-02-29T04:44:59.951Z',
                },
                {
                    question_code: 1,
                    score: 2,
                    answer_at: '2024-02-29T04:44:59.953Z',
                },
                {
                    question_code: 29,
                    score: 3,
                    answer_at: '2024-02-29T04:44:59.994Z',
                },
                {
                    question_code: 115,
                    score: 4,
                    answer_at: '2024-02-29T04:45:00.070Z',
                },
                {
                    question_code: 108,
                    score: 1,
                    answer_at: '2024-02-29T04:45:00.160Z',
                },
                {
                    question_code: 13,
                    score: 2,
                    answer_at: '2024-02-29T04:45:00.181Z',
                },
                {
                    question_code: 129,
                    score: 3,
                    answer_at: '2024-02-29T04:45:00.218Z',
                },
                {
                    question_code: 100,
                    score: 4,
                    answer_at: '2024-02-29T04:45:00.253Z',
                },
            ],
        } as SafeAny,
        result_raw: {
            scores: [
                {
                    domain_id: 3,
                    model_type: 'FIVE_FACTOR_MODEL',
                    domain_alias: 'openness_to_experience',
                    domain_order: 1,
                    traits: [
                        {
                            trait_id: 13,
                            trait_alias: 'imagination',
                            trait_order: 1,
                            trait_score: 0.5,
                        },
                        {
                            trait_id: 14,
                            trait_alias: 'artistic_interests',
                            trait_order: 2,
                            trait_score: 0.8125,
                        },
                        {
                            trait_id: 15,
                            trait_alias: 'emotionality',
                            trait_order: 3,
                            trait_score: 0.125,
                        },
                        {
                            trait_id: 16,
                            trait_alias: 'adventurousness',
                            trait_order: 4,
                            trait_score: 0.625,
                        },
                        {
                            trait_id: 17,
                            trait_alias: 'intellect',
                            trait_order: 5,
                            trait_score: 0.625,
                        },
                        {
                            trait_id: 18,
                            trait_alias: 'liberalism',
                            trait_order: 6,
                            trait_score: 0.75,
                        },
                    ],
                    domain_score: 0.5729166666666666,
                },
                {
                    domain_id: 5,
                    model_type: 'FIVE_FACTOR_MODEL',
                    domain_alias: 'conscientiousness',
                    domain_order: 2,
                    traits: [
                        {
                            trait_id: 25,
                            trait_alias: 'self_efficacy',
                            trait_order: 1,
                            trait_score: 1,
                        },
                        {
                            trait_id: 26,
                            trait_alias: 'orderliness',
                            trait_order: 2,
                            trait_score: 0.25,
                        },
                        {
                            trait_id: 27,
                            trait_alias: 'dutifulness',
                            trait_order: 3,
                            trait_score: 0.625,
                        },
                        {
                            trait_id: 28,
                            trait_alias: 'achievement_striving',
                            trait_order: 4,
                            trait_score: 1,
                        },
                        {
                            trait_id: 29,
                            trait_alias: 'self_discipline',
                            trait_order: 5,
                            trait_score: 0.125,
                        },
                        {
                            trait_id: 30,
                            trait_alias: 'cautiousness',
                            trait_order: 6,
                            trait_score: 0.625,
                        },
                    ],
                    domain_score: 0.6041666666666666,
                },
                {
                    domain_id: 2,
                    model_type: 'FIVE_FACTOR_MODEL',
                    domain_alias: 'extraversion',
                    domain_order: 3,
                    traits: [
                        {
                            trait_id: 7,
                            trait_alias: 'friendliness',
                            trait_order: 1,
                            trait_score: 0.5,
                        },
                        {
                            trait_id: 8,
                            trait_alias: 'gregariousness',
                            trait_order: 2,
                            trait_score: 0.625,
                        },
                        {
                            trait_id: 9,
                            trait_alias: 'assertiveness',
                            trait_order: 3,
                            trait_score: 0.625,
                        },
                        {
                            trait_id: 10,
                            trait_alias: 'activity_level',
                            trait_order: 4,
                            trait_score: 0.5,
                        },
                        {
                            trait_id: 11,
                            trait_alias: 'excitement_seeking',
                            trait_order: 5,
                            trait_score: 1,
                        },
                        {
                            trait_id: 12,
                            trait_alias: 'cheerfulness',
                            trait_order: 6,
                            trait_score: 0.625,
                        },
                    ],
                    domain_score: 0.6458333333333334,
                },
                {
                    domain_id: 4,
                    model_type: 'FIVE_FACTOR_MODEL',
                    domain_alias: 'agreeableness',
                    domain_order: 4,
                    traits: [
                        {
                            trait_id: 19,
                            trait_alias: 'trust',
                            trait_order: 1,
                            trait_score: 0.75,
                        },
                        {
                            trait_id: 20,
                            trait_alias: 'morality',
                            trait_order: 2,
                            trait_score: 0.5833333333333334,
                        },
                        {
                            trait_id: 21,
                            trait_alias: 'altruism',
                            trait_order: 3,
                            trait_score: 0.5833333333333334,
                        },
                        {
                            trait_id: 22,
                            trait_alias: 'cooperation',
                            trait_order: 4,
                            trait_score: 0.25,
                        },
                        {
                            trait_id: 23,
                            trait_alias: 'modesty',
                            trait_order: 5,
                            trait_score: 0.75,
                        },
                        {
                            trait_id: 24,
                            trait_alias: 'sympathy',
                            trait_order: 6,
                            trait_score: 0.75,
                        },
                    ],
                    domain_score: 0.6111111111111112,
                },
                {
                    domain_id: 1,
                    model_type: 'FIVE_FACTOR_MODEL',
                    domain_alias: 'emotional_stability',
                    domain_order: 5,
                    traits: [
                        {
                            trait_id: 1,
                            trait_alias: 'anxiety',
                            trait_order: 1,
                            trait_score: 0.5,
                        },
                        {
                            trait_id: 2,
                            trait_alias: 'anger',
                            trait_order: 2,
                            trait_score: 0.125,
                        },
                        {
                            trait_id: 3,
                            trait_alias: 'depression',
                            trait_order: 3,
                            trait_score: 0.75,
                        },
                        {
                            trait_id: 4,
                            trait_alias: 'self_consciousness',
                            trait_order: 4,
                            trait_score: 0.625,
                        },
                        {
                            trait_id: 5,
                            trait_alias: 'immoderation',
                            trait_order: 5,
                            trait_score: 1,
                        },
                        {
                            trait_id: 6,
                            trait_alias: 'vulnerability',
                            trait_order: 6,
                            trait_score: 0.5,
                        },
                    ],
                    domain_score: 0.5833333333333334,
                },
                {
                    domain_name: 'Core Self-Evaluations',
                    domain_score: 0.625,
                    domain_id: 6,
                    model_type: 'CORE_SELF_EVALUATIONS',
                    domain_alias: 'core_self_evaluations',
                    domain_order: 6,
                    traits: [],
                },
                {
                    domain_name: 'Performance Orientation',
                    domain_score: 0.8125,
                    domain_id: 7,
                    model_type: 'GOAL_ORIENTATIONS',
                    domain_alias: 'performance_orientation',
                    domain_order: 7,
                    traits: [],
                },
                {
                    domain_name: 'Mastery Orientation',
                    domain_score: 0.8125,
                    domain_id: 8,
                    model_type: 'GOAL_ORIENTATIONS',
                    domain_alias: 'mastery_orientation',
                    domain_order: 8,
                    traits: [],
                },
                {
                    domain_name: 'Self-monitoring',
                    domain_score: 0.3125,
                    domain_id: 9,
                    model_type: 'SELF_MONITORING',
                    domain_alias: 'self_monitoring',
                    domain_order: 9,
                    traits: [],
                },
            ],
        } as SafeAny,
        ...TestData.auditData,
    });
