import {
    JobApplicationScoreType,
    PersonalityCognitiveScoreDomainAlias,
    QuestionnaireFramework,
} from '../constants';

export class CognitiveOutcomeDto {
    domain_alias?: string;
    domain_score!: number;
    domain_percentile!: number | null;
    ingredient_weightage?: number | null;
}

export type CognitiveQuestionnaireFramework =
    | QuestionnaireFramework.REASONING_NUMERIC
    | QuestionnaireFramework.REASONING_LOGIC
    | QuestionnaireFramework.REASONING_VERBAL;

export type CognitiveScoreType =
    | JobApplicationScoreType.REASONING_NUMERIC
    | JobApplicationScoreType.REASONING_LOGICAL
    | JobApplicationScoreType.REASONING_VERBAL;

export type CognitiveDomainAlias =
    | PersonalityCognitiveScoreDomainAlias.NUMERIC
    | PersonalityCognitiveScoreDomainAlias.LOGICAL
    | PersonalityCognitiveScoreDomainAlias.VERBAL;

export type CognitiveResult = {
    [K in keyof CognitiveOutcomeDto]?: CognitiveOutcomeDto[K] | null;
};

export interface CognitiveScoreOutcome {
    score_type: JobApplicationScoreType;
    outcome: CognitiveOutcomeDto;
}

export interface CognitiveScoreOutcomePayload {
    cognitive_result: CognitiveOutcomeDto;
}
