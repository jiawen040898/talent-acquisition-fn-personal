import { SkillExtractAPI } from '@pulsifi/configs';
import {
    SkillExtractAPIErrorCode,
    SkillExtractAPIErrorMessage,
    SkillExtractAPIErrorType,
} from '@pulsifi/constants';
import { ErrorDetails } from '@pulsifi/fn';
import { TextResume, TextSummaryResponse } from '@pulsifi/interfaces';
import axios from 'axios';

const getOpenAISkills = async (
    textSummary: TextResume,
): Promise<TextSummaryResponse> => {
    let result;
    const url = SkillExtractAPI().apiUrl;
    const authToken = SkillExtractAPI().apiKey;
    const SKILL_EXTRACT_API_REQUEST_TIMEOUT_40S = 40000;
    const skillExtractApiTimeoutErrorMessage =
        'Https call terminated due to timeout 40s';

    try {
        result = await axios
            .post(url, textSummary, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                timeout: SKILL_EXTRACT_API_REQUEST_TIMEOUT_40S,
                timeoutErrorMessage: skillExtractApiTimeoutErrorMessage,
            })
            .then((response) => {
                return response.data;
            });

        return result;
    } catch (error) {
        throw new FailedToGetExtractedSkillFromExtractSkillAPI({
            error_codes: [
                SkillExtractAPIErrorCode.FAILED_TO_GET_EXTRACTED_SKILL,
            ],
            error,
        });
    }
};

export class FailedToGetExtractedSkillFromExtractSkillAPI extends Error {
    errorDetails: ErrorDetails;

    constructor(errorDetails: ErrorDetails) {
        super(SkillExtractAPIErrorMessage.FAILED_TO_GET_EXTRACTED_SKILL);
        this.name = SkillExtractAPIErrorType.FAILED_TO_GET_EXTRACTED_SKILL;
        this.errorDetails = errorDetails;
    }
}

export const SkillExtractAPIService = {
    getOpenAISkills,
};
