import { ScreeningAnswerCriteria } from '@pulsifi/constants';
import {
    JobApplicationQuestionnaire,
    JobApplicationScreeningAnswer,
} from '@pulsifi/models';
import { roundDecimalPlace } from '@pulsifi/shared';
import { isEmpty } from 'lodash';

const DECIMAL_PLACES = 7;

export const ScreeningUtils = {
    calculateCriteriaSummary: (
        screeningAnswers: JobApplicationScreeningAnswer[],
    ): [number, boolean, number, number] => {
        let passPercentage = 100;
        let hasPassScreening = true;
        if (isEmpty(screeningAnswers)) {
            return [passPercentage, hasPassScreening, 0, 0];
        }

        const totalCompute = screeningAnswers.filter(
            (s) => s.criteria_status !== ScreeningAnswerCriteria.NONE,
        ).length;
        const totalPass = screeningAnswers.filter(
            (s) => s.criteria_status === ScreeningAnswerCriteria.PASS,
        ).length;

        if (totalCompute === 0) {
            return [passPercentage, hasPassScreening, 0, 0];
        }

        if (totalCompute > 0) {
            passPercentage = roundDecimalPlace(
                (totalPass / totalCompute) * 100,
            );
            hasPassScreening = totalCompute === totalPass;
        }

        return [passPercentage, hasPassScreening, totalCompute, totalPass];
    },

    /** if detect any criteria_status = 'fail', return false */
    checkPassScreening: (
        screeningAnswers: JobApplicationScreeningAnswer[],
    ): boolean => {
        let hasPassScreening = true;
        if (!screeningAnswers) {
            return hasPassScreening;
        }

        if (!isEmpty(screeningAnswers)) {
            const totalFailScreeningAnswers: JobApplicationScreeningAnswer[] =
                screeningAnswers.filter((x: JobApplicationScreeningAnswer) => {
                    if (x.criteria_status === ScreeningAnswerCriteria.FAIL) {
                        return x;
                    }
                });
            if (!isEmpty(totalFailScreeningAnswers)) {
                hasPassScreening = false;
            }
        }

        return hasPassScreening;
    },

    calculateAssessmentCompletionPercentage: (
        questionnaires: JobApplicationQuestionnaire[],
        totalQuestionnaires: number,
    ): number => {
        let assessmentCompletionPercentage = 0;
        if (!questionnaires.length) {
            return 0;
        }

        if (totalQuestionnaires < 1) {
            return 0;
        }

        let totalCompletedQuestionnaires: JobApplicationQuestionnaire[] = [];
        if (!isEmpty(questionnaires)) {
            totalCompletedQuestionnaires = questionnaires.filter(
                (x: JobApplicationQuestionnaire) => {
                    if (x.completed_at) {
                        return x;
                    }
                },
            );
        }

        if (totalCompletedQuestionnaires.length > 0) {
            assessmentCompletionPercentage =
                (totalCompletedQuestionnaires.length / totalQuestionnaires) *
                100;
        }

        return +parseFloat(`${assessmentCompletionPercentage}`).toFixed(
            DECIMAL_PLACES,
        );
    },

    parseDecimal: (value: number): number => {
        return +parseFloat(`${value}`).toFixed(DECIMAL_PLACES);
    },
};
