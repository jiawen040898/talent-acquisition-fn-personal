import {
    JobApplicationScoreType,
    SCORE_DECIMAL_PLACES,
    SCORE_MULTIPLIER,
    SCORE_PERCENTAGE_MULTIPLIER,
} from '@pulsifi/constants';
import { numberUtil } from '@pulsifi/fn';

const cognitiveScoreTypes = [
    JobApplicationScoreType.REASONING_LOGICAL,
    JobApplicationScoreType.REASONING_NUMERIC,
    JobApplicationScoreType.REASONING_VERBAL,
    JobApplicationScoreType.REASONING_AVG,
];

const isCognitiveScoreType = (scoreType: JobApplicationScoreType): boolean =>
    cognitiveScoreTypes.includes(scoreType);

const getOriginalDomainScore = (
    score: number,
    scoreType: JobApplicationScoreType,
): number => {
    if (isCognitiveScoreType(scoreType)) {
        return score / SCORE_PERCENTAGE_MULTIPLIER;
    }
    return score / SCORE_MULTIPLIER;
};

const getFormattedJobApplicationScore = (
    score: number,
    scoreType: JobApplicationScoreType,
): number => {
    let multipliedScore = score * SCORE_MULTIPLIER;
    if (isCognitiveScoreType(scoreType)) {
        multipliedScore = score * SCORE_PERCENTAGE_MULTIPLIER;
    }

    return numberUtil.roundDecimalPlace(multipliedScore, SCORE_DECIMAL_PLACES);
};

export const JobApplicationScoreUtil = {
    getOriginalDomainScore,
    getFormattedJobApplicationScore,
};
