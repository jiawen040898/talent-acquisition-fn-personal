/** PersonScoreEventType.PERSONALITY_OUTCOME_CALCULATED */

import { JobApplicationSkillSource } from '@pulsifi/constants';

export class OutcomeDto {
    domain_id!: number;
    domain_alias!: string;
    domain_score!: number;
    traits!: SafeAny[];
    domain_weightage!: number;
}

export class OnetOutcomeDto {
    domain_alias!: string;
    domain_score!: number;
    outcome!: OutcomeDto[];
    ingredient_weightage!: number;
}

export class InterestRiasecOutcomeDto {
    domain_alias!: string;
    domain_score!: number;
}

export class InterestRiasecDto {
    domain_alias!: string;
    domain_score!: number;
    person_codes?: string[];
    job_codes?: string[];
    outcome!: InterestRiasecOutcomeDto[];
    ingredient_weightage!: number;
}

export class PersonalityOutcomeCalculated {
    id!: string;
    person_id!: string;
    person_type!: string;
    job_score_recipe_id!: string;
    process_id!: number;
    process_type!: string;
    work_style?: OnetOutcomeDto;
    work_value?: OnetOutcomeDto;
    interest_riasec?: InterestRiasecDto;

    onet_work_style?: OutcomeDto[];
    onet_work_value?: OutcomeDto[];
    work_interest?: InterestRiasecOutcomeDto[];
}

/** PersonScoreEventType.PAIRWISE_SCORE_CALCULATED */

export class SkillDto {
    skill_name!: string;
    score!: number;
    match!: boolean;
    source?: JobApplicationSkillSource | null;
}

export class PairwiseSkillDto {
    skill_name!: string;
    matches!: SkillDto[];
}

export class JobScoreDto {
    job_title!: string;
    score!: number;
}

export class PairwiseTitleDto {
    previous_employment!: string;
    matches!: JobScoreDto[];
}

export class PairwiseScoreDto {
    domain_alias!: string;
    domain_score!: number;
    pairwise_skill?: PairwiseSkillDto[];
    pairwise_title?: PairwiseTitleDto[];
    ingredient_weightage!: number;
}

export class PersonalityPairwiseScoreCalculated {
    id!: string;
    person_id!: string;
    person_type!: string;
    job_score_recipe_id!: string;
    process_id!: number;
    process_type!: string;
    payload!: PairwiseScoreDto[];
}

/** PersonScoreEventType.COGNITIVE_SCORES_CALCULATED */

export class CognitiveScoreDto {
    domain_alias!: string;
    domain_score!: number;
    domain_percentile!: number;
    ingredient_weightage?: number;
}

export class PersonalityCognitiveScoresCalculated {
    id!: string;
    person_id!: string;
    person_type!: string;
    job_score_recipe_id!: string;
    process_id!: number;
    process_type!: string;
    payload!: CognitiveScoreDto[];
}

/** PersonScoreEventType.FIT_SCORE_CALCULATED */

export class FitScoreOutcomeDto {
    ingredient_alias!: string;
    ingredient_score!: number;
    ingredient_weightage!: number;
}

export class PersonalityRoleFitScoreCalculated {
    id!: string;
    person_id!: string;
    person_type!: string;
    job_score_recipe_id!: string;
    process_id!: number;
    process_type!: string;
    domain_alias!: string;
    domain_score!: number;
    outcome!: FitScoreOutcomeDto[];
}

export class PersonalityCultureFitScoreCalculated {
    id!: string;
    person_id!: string;
    person_type!: string;
    job_score_recipe_id!: string;
    process_id!: number;
    process_type!: string;
    domain_alias!: string;
    domain_score!: number;
    outcome!: OutcomeDto[];
}
