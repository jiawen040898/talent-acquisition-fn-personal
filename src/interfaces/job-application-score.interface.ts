import { JobApplicationScoreType } from '@pulsifi/constants';

import { CognitiveScoreOutcomePayload } from './cognitive-score.interface';
import {
    CultureFitScoreOutcomePayload,
    RoleFitScoreOutcomePayload,
} from './fit-score.interface';
import { PairwiseScoreOutcomePayload } from './pairwise-score.interface';
import { PersonalityScoreOutcomePayload } from './personality-score.interface';

export type JobApplicationScoreOutcome =
    | JSON
    | CultureFitScoreOutcomePayload
    | RoleFitScoreOutcomePayload
    | PersonalityScoreOutcomePayload
    | CognitiveScoreOutcomePayload
    | PairwiseScoreOutcomePayload;

export interface PartialScoreOutput {
    score?: number;
    score_outcome: JobApplicationScoreOutcome;
    score_type: JobApplicationScoreType;
    score_dimension: number;
}
