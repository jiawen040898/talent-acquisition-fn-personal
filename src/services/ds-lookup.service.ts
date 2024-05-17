import { AWSConfig } from '@pulsifi/configs';
import {
    DSLookupAPIErrorCode,
    DSLookupAPIErrorMessage,
    DSLookupAPIErrorType,
} from '@pulsifi/constants';
import { ErrorDetails } from '@pulsifi/fn';
import axios from 'axios';

export interface GetPairwiseSimilarity {
    score: number;
    pairwise_score: {
        [key: string]: {
            [key: string]: number;
        };
    };
}

const getPairwiseSimilarity = async (
    main: JSON | string[] | null,
    secondary: string[] | null,
): Promise<GetPairwiseSimilarity | undefined> => {
    const payload = {
        main,
        secondary,
    };

    const path = `${AWSConfig().alb.dns}/lookup/ds/pairwise-similarity/score`;

    try {
        const res = await axios.post<GetPairwiseSimilarity>(path, payload);

        return res.data;
    } catch (err) {
        throw new FailedToGetPairwiseSimilarityFromDSLookupApi({
            error_codes: [
                DSLookupAPIErrorCode.FAILED_TO_GET_PAIRWISE_SIMILARITY,
            ],
            err,
        });
    }
};

export class FailedToGetPairwiseSimilarityFromDSLookupApi extends Error {
    errorDetails: ErrorDetails;

    constructor(errorDetails: ErrorDetails) {
        super(DSLookupAPIErrorMessage.FAILED_TO_GET_PAIRWISE_SIMILARITY);
        this.name = DSLookupAPIErrorType.FAILED_TO_GET_PAIRWISE_SIMILARITY;
        this.errorDetails = errorDetails;
    }
}

export const DSLookupService = {
    getPairwiseSimilarity,
};
