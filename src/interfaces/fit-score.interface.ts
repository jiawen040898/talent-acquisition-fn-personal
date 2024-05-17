import { DomainOutcome, IngredientOutcome, TraitOutcome } from '@pulsifi/fn';

export type DomainTraitOutcome = DomainOutcome & { traits?: TraitOutcome[] };

export interface CultureFitScoreOutcomePayload {
    personality_result: DomainTraitOutcome[];
    framework_alias?: string | null;
}

export type IngredientOutcomeWithRoundingAdjustment = IngredientOutcome & {
    display_weightage_rounding_adjustment?: number;
    display_score_rounding_adjustment?: number;
};

export interface RoleFitScoreOutcomePayload {
    ingredient_result: IngredientOutcomeWithRoundingAdjustment[];
}
