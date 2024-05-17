import { ScreeningAnswerCriteria } from '@pulsifi/constants';
import {
    JobApplicationQuestionnaire,
    JobApplicationScreeningAnswer,
} from '@pulsifi/models';
import { ScreeningUtils } from '@pulsifi/shared';

import {
    jobApplicationQuestionnaire30,
    jobApplicationScreeningAnswer,
} from '../fixtures';

const noneScreeningAnswer: JobApplicationScreeningAnswer = {
    ...jobApplicationScreeningAnswer,
    company_id: 1,
    criteria_status: ScreeningAnswerCriteria.NONE,
    created_by: 1,
    updated_by: 1,
};

const passScreeningAnswer: JobApplicationScreeningAnswer = {
    ...jobApplicationScreeningAnswer,
    company_id: 1,
    criteria_status: ScreeningAnswerCriteria.PASS,
    created_by: 1,
    updated_by: 1,
};

const failScreeningAnswer: JobApplicationScreeningAnswer = {
    ...jobApplicationScreeningAnswer,
    company_id: 1,
    criteria_status: ScreeningAnswerCriteria.FAIL,
    created_by: 1,
    updated_by: 1,
};

const completedJobApplicationQuestionnaire: JobApplicationQuestionnaire = {
    ...jobApplicationQuestionnaire30,
    created_by: 1,
    updated_by: 1,
};

const inProgressJobApplicationQuestionnaire: JobApplicationQuestionnaire = {
    ...jobApplicationQuestionnaire30,
    completed_at: undefined,
    created_by: 1,
    updated_by: 1,
};

describe('ScreeningUtil', () => {
    it('should pass for checkPassScreening with no screening answers', async () => {
        const [
            criteriaMetPercentage,
            hasPassScreening,
            totalScreenings,
            totalScreeningsPass,
        ] = ScreeningUtils.calculateCriteriaSummary([]);

        expect(criteriaMetPercentage).toEqual(100);
        expect(totalScreenings).toEqual(0);
        expect(totalScreeningsPass).toEqual(0);
        expect(hasPassScreening).toEqual(true);
    });

    it('should pass for checkPassScreening with none criteria status', async () => {
        const [
            criteriaMetPercentage,
            hasPassScreening,
            totalScreenings,
            totalScreeningsPass,
        ] = ScreeningUtils.calculateCriteriaSummary([noneScreeningAnswer]);

        expect(criteriaMetPercentage).toEqual(100);
        expect(totalScreenings).toEqual(0);
        expect(totalScreeningsPass).toEqual(0);
        expect(hasPassScreening).toEqual(true);
    });

    it('should pass for checkPassScreening with pass + none criteria status', async () => {
        const [
            criteriaMetPercentage,
            hasPassScreening,
            totalScreenings,
            totalScreeningsPass,
        ] = ScreeningUtils.calculateCriteriaSummary([
            noneScreeningAnswer,
            passScreeningAnswer,
        ]);

        expect(criteriaMetPercentage).toEqual(100);
        expect(totalScreenings).toEqual(1);
        expect(totalScreeningsPass).toEqual(1);
        expect(hasPassScreening).toEqual(true);
    });

    it('should fail for checkPassScreening with pass + none + fail criteria status', async () => {
        const [
            criteriaMetPercentage,
            hasPassScreening,
            totalScreenings,
            totalScreeningsPass,
        ] = ScreeningUtils.calculateCriteriaSummary([
            noneScreeningAnswer,
            passScreeningAnswer,
            failScreeningAnswer,
        ]);
        expect(criteriaMetPercentage).toEqual(50);
        expect(totalScreenings).toEqual(2);
        expect(totalScreeningsPass).toEqual(1);
        expect(hasPassScreening).toEqual(false);
    });

    it('should return 100 for calculateCriteriaMetPercentage with no screening answers', async () => {
        const [
            criteriaMetPercentage,
            hasPassScreening,
            totalScreenings,
            totalScreeningsPass,
        ] = ScreeningUtils.calculateCriteriaSummary([]);
        expect(hasPassScreening).toEqual(true);
        expect(totalScreenings).toEqual(0);
        expect(totalScreeningsPass).toEqual(0);
        expect(criteriaMetPercentage).toEqual(100);
    });

    it('should return 100 for calculateCriteriaMetPercentage with none criteria status', async () => {
        const [
            criteriaMetPercentage,
            hasPassScreening,
            totalScreenings,
            totalScreeningsPass,
        ] = ScreeningUtils.calculateCriteriaSummary([noneScreeningAnswer]);
        expect(hasPassScreening).toEqual(true);
        expect(totalScreenings).toEqual(0);
        expect(totalScreeningsPass).toEqual(0);
        expect(criteriaMetPercentage).toEqual(100);
    });

    it('should return 50 for calculateCriteriaMetPercentage with 1 pass and 1 fail criteria status', async () => {
        const [
            criteriaMetPercentage,
            hasPassScreening,
            totalScreenings,
            totalScreeningsPass,
        ] = ScreeningUtils.calculateCriteriaSummary([
            noneScreeningAnswer,
            passScreeningAnswer,
            failScreeningAnswer,
        ]);
        expect(hasPassScreening).toEqual(false);
        expect(totalScreenings).toEqual(2);
        expect(totalScreeningsPass).toEqual(1);
        expect(criteriaMetPercentage).toEqual(50);
    });

    it('should return 66.6666667 for calculateCriteriaMetPercentage with 2 pass and 1 fail criteria status', async () => {
        const [
            criteriaMetPercentage,
            hasPassScreening,
            totalScreenings,
            totalScreeningsPass,
        ] = ScreeningUtils.calculateCriteriaSummary([
            noneScreeningAnswer,
            passScreeningAnswer,
            passScreeningAnswer,
            failScreeningAnswer,
        ]);
        expect(hasPassScreening).toEqual(false);
        expect(totalScreenings).toEqual(3);
        expect(totalScreeningsPass).toEqual(2);
        expect(criteriaMetPercentage).toEqual(66.67);
    });

    it('should return 0 for calculateCriteriaMetPercentage with 1 fail criteria status', async () => {
        const [
            criteriaMetPercentage,
            hasPassScreening,
            totalScreenings,
            totalScreeningsPass,
        ] = ScreeningUtils.calculateCriteriaSummary([
            noneScreeningAnswer,
            failScreeningAnswer,
        ]);
        expect(hasPassScreening).toEqual(false);
        expect(totalScreenings).toEqual(1);
        expect(totalScreeningsPass).toEqual(0);
        expect(criteriaMetPercentage).toEqual(0);
    });

    it('should return 0 for calculateCriteriaMetPercentage with 2 fail criteria status', async () => {
        const [
            criteriaMetPercentage,
            hasPassScreening,
            totalScreenings,
            totalScreeningsPass,
        ] = ScreeningUtils.calculateCriteriaSummary([
            noneScreeningAnswer,
            failScreeningAnswer,
            failScreeningAnswer,
        ]);
        expect(hasPassScreening).toEqual(false);
        expect(totalScreenings).toEqual(2);
        expect(totalScreeningsPass).toEqual(0);
        expect(criteriaMetPercentage).toEqual(0);
    });

    it('should return 100 for calculateAssessmentCompletionPercentage with 2 completed questionnaires', async () => {
        const assessmentCompletionPercentage =
            ScreeningUtils.calculateAssessmentCompletionPercentage(
                [
                    completedJobApplicationQuestionnaire,
                    completedJobApplicationQuestionnaire,
                ],
                2,
            );

        expect(assessmentCompletionPercentage).toEqual(100);
    });

    it('should return 0 for calculateAssessmentCompletionPercentage with no questionnaires', async () => {
        const assessmentCompletionPercentage =
            ScreeningUtils.calculateAssessmentCompletionPercentage([], 1);

        expect(assessmentCompletionPercentage).toEqual(0);
    });

    it('should return 50 for calculateAssessmentCompletionPercentage with 1 completed and 1 in progress questionnaires', async () => {
        const assessmentCompletionPercentage =
            ScreeningUtils.calculateAssessmentCompletionPercentage(
                [
                    completedJobApplicationQuestionnaire,
                    inProgressJobApplicationQuestionnaire,
                ],
                2,
            );

        expect(assessmentCompletionPercentage).toEqual(50);
    });

    it('should return 66.6666667 for calculateAssessmentCompletionPercentage with 2 completed and 1 in progress questionnaires', async () => {
        const assessmentCompletionPercentage =
            ScreeningUtils.calculateAssessmentCompletionPercentage(
                [
                    completedJobApplicationQuestionnaire,
                    completedJobApplicationQuestionnaire,
                    inProgressJobApplicationQuestionnaire,
                ],
                3,
            );

        expect(assessmentCompletionPercentage).toEqual(66.6666667);
    });

    it('should return 0 for calculateAssessmentCompletionPercentage when total_questionnaires = 0', async () => {
        const assessmentCompletionPercentage =
            ScreeningUtils.calculateAssessmentCompletionPercentage(
                [completedJobApplicationQuestionnaire],
                0,
            );

        expect(assessmentCompletionPercentage).toEqual(0);
    });

    it('should return 7 decimal places value', async () => {
        const output = ScreeningUtils.parseDecimal(+'3e-7');

        expect(output).toEqual(0.0000003);
    });
});
