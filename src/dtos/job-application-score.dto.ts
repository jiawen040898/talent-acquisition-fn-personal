import { JobApplicationScoreOutcome } from '@pulsifi/interfaces';
import { JobApplicationScore } from '@pulsifi/models';

export class JobApplicationScoreDto {
    id?: number;
    job_application_id: string;
    score_recipe_id?: string;
    score_outcome?: JobApplicationScoreOutcome;
    score_type: string;
    score_dimension: number;
    score?: number | null;
    percentile?: number;
    percentile_source?: string;
    percentile_api_version?: string;

    constructor(input: JobApplicationScore) {
        this.id = input.id;
        this.job_application_id = input.job_application_id;
        this.score_recipe_id = input.score_recipe_id;
        this.score_outcome = input.score_outcome;
        this.score_type = input.score_type;
        this.score_dimension = input.score_dimension;
        this.score = input.score;
        this.percentile = input.percentile;
        this.percentile_source = input.percentile_source;
        this.percentile_api_version = input.percentile_api_version;
    }
}
