import { PairwiseSkillDto, PairwiseTitleDto } from '@pulsifi/dtos';

export interface PairwiseScoreOutcomePayload {
    pairwise_result: PairwiseSkillDto[] | PairwiseTitleDto[];
}
