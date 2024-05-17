import { JobApplicationScoreType } from '@pulsifi/constants';
import {
    JobApplicationScoreDto,
    PersonalityCultureFitScoreCalculated,
} from '@pulsifi/dtos';
import { generatorUtil, objectParser } from '@pulsifi/fn';
import { ScreeningUtils } from '@pulsifi/shared';

export const mockPersonalityFrameworkScoreCalculated: PersonalityCultureFitScoreCalculated =
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
                domain_id: 0,
                domain_alias: 'people_centric',
                domain_score: 0.44212663173675537,
                domain_weightage: 0.05,
                traits: [
                    {
                        trait_id: 59,
                        trait_alias: 'concern_for_others',
                        trait_score: 0.5625,
                        trait_weightage: 0.324343,
                    },
                ],
            },
            {
                domain_id: 0,
                domain_alias: 'people_centric',
                domain_score: 0.44212663173675537,
                domain_weightage: 0.05,
                traits: [
                    {
                        trait_id: 59,
                        trait_alias: 'concern_for_others',
                        trait_score: 0.5625,
                        trait_weightage: 0.324343,
                    },
                ],
            },
            {
                domain_id: 0,
                domain_alias: 'people_centric',
                domain_score: 0.44212663173675537,
                domain_weightage: 0.05,
                traits: [
                    {
                        trait_id: 59,
                        trait_alias: 'concern_for_others',
                        trait_score: 0.5625,
                        trait_weightage: 0.324343,
                    },
                ],
            },
            {
                domain_id: 0,
                domain_alias: 'people_centric',
                domain_score: 0.44212663173675537,
                domain_weightage: 0.05,
                traits: [
                    {
                        trait_id: 59,
                        trait_alias: 'concern_for_others',
                        trait_score: 0.5625,
                        trait_weightage: 0.324343,
                    },
                ],
            },
            {
                domain_id: 0,
                domain_alias: 'people_centric',
                domain_score: 0.44212663173675537,
                domain_weightage: 0.05,
                traits: [
                    {
                        trait_id: 59,
                        trait_alias: 'concern_for_others',
                        trait_score: 0.5625,
                        trait_weightage: 0.324343,
                    },
                ],
            },
            {
                domain_id: 0,
                domain_alias: 'people_centric',
                domain_score: 0.44212663173675537,
                domain_weightage: 0.05,
                traits: [
                    {
                        trait_id: 59,
                        trait_alias: 'concern_for_others',
                        trait_score: 0.5625,
                        trait_weightage: 0.324343,
                    },
                ],
            },
        ],
    };

export const frameworkScore: JobApplicationScoreDto = {
    id: 10,
    job_application_id: 'd84cf427-0b99-4d70-b430-a75ee8ae000e',
    percentile: undefined,
    percentile_api_version: undefined,
    percentile_source: undefined,
    score: ScreeningUtils.parseDecimal(
        mockPersonalityFrameworkScoreCalculated.domain_score * 10,
    ),
    score_dimension: 0,
    score_recipe_id:
        mockPersonalityFrameworkScoreCalculated.job_score_recipe_id,
    score_type: JobApplicationScoreType.CULTURE_FIT,
    score_outcome: objectParser.toJSON({
        framework_alias: mockPersonalityFrameworkScoreCalculated.domain_alias,
        personality_result: mockPersonalityFrameworkScoreCalculated.outcome,
    }),
};
