import { JobApplicationScoreType } from '@pulsifi/constants';
import { JobApplicationScoreUtil } from '@pulsifi/shared';

describe('JobApplicationScoreUtil', () => {
    describe('getOriginalDomainScore', () => {
        it.each([
            {
                score: 82.345345321,
                scoreType: JobApplicationScoreType.REASONING_LOGICAL,
                expected: 0.82345345321,
            },
            {
                score: 82.345345321,
                scoreType: JobApplicationScoreType.REASONING_VERBAL,
                expected: 0.82345345321,
            },
            {
                score: 82.345345321,
                scoreType: JobApplicationScoreType.REASONING_NUMERIC,
                expected: 0.82345345321,
            },
            {
                score: 82.345345321,
                scoreType: JobApplicationScoreType.REASONING_AVG,
                expected: 0.82345345321,
            },
            {
                score: 8.2345345321,
                scoreType: JobApplicationScoreType.WORK_STYLE,
                expected: 0.82345345321,
            },
            {
                score: 8.2345345321,
                scoreType: JobApplicationScoreType.WORK_VALUE,
                expected: 0.82345345321,
            },
            {
                score: 8.2345345321,
                scoreType: JobApplicationScoreType.WORK_INTEREST,
                expected: 0.82345345321,
            },
            {
                score: 8.2345345321,
                scoreType: JobApplicationScoreType.WORK_EXP,
                expected: 0.82345345321,
            },
            {
                score: 8.2345345321,
                scoreType: JobApplicationScoreType.HARD_SKILL,
                expected: 0.82345345321,
            },
            {
                score: 8.2345345321,
                scoreType: JobApplicationScoreType.ROLE_FIT,
                expected: 0.82345345321,
            },
            {
                score: 8.2345345321,
                scoreType: JobApplicationScoreType.CULTURE_FIT,
                expected: 0.82345345321,
            },
        ])(
            'should return correct original domain score when score type is $scoreType',
            ({ score, scoreType, expected }) => {
                // Act
                const result = JobApplicationScoreUtil.getOriginalDomainScore(
                    score,
                    scoreType,
                );

                // Assert
                expect(result).toEqual(expected);
            },
        );
    });

    describe('getFormattedJobApplicationScore', () => {
        it.each([
            {
                score: 0.82345345321,
                scoreType: JobApplicationScoreType.REASONING_LOGICAL,
                expected: 82.3453453,
            },
            {
                score: 0.82345345321,
                scoreType: JobApplicationScoreType.REASONING_VERBAL,
                expected: 82.3453453,
            },
            {
                score: 0.82345345321,
                scoreType: JobApplicationScoreType.REASONING_NUMERIC,
                expected: 82.3453453,
            },
            {
                score: 0.82345345321,
                scoreType: JobApplicationScoreType.REASONING_AVG,
                expected: 82.3453453,
            },
            {
                score: 0.82345345321,
                scoreType: JobApplicationScoreType.WORK_STYLE,
                expected: 8.2345345,
            },
            {
                score: 0.82345345321,
                scoreType: JobApplicationScoreType.WORK_VALUE,
                expected: 8.2345345,
            },
            {
                score: 0.82345345321,
                scoreType: JobApplicationScoreType.WORK_INTEREST,
                expected: 8.2345345,
            },
            {
                score: 0.82345345321,
                scoreType: JobApplicationScoreType.WORK_EXP,
                expected: 8.2345345,
            },
            {
                score: 0.82345345321,
                scoreType: JobApplicationScoreType.HARD_SKILL,
                expected: 8.2345345,
            },
            {
                score: 0.82345345321,
                scoreType: JobApplicationScoreType.ROLE_FIT,
                expected: 8.2345345,
            },
            {
                score: 0.82345345321,
                scoreType: JobApplicationScoreType.CULTURE_FIT,
                expected: 8.2345345,
            },
        ])(
            'should return correct formatted job application score when score type is $scoreType',
            ({ score, scoreType, expected }) => {
                // Act
                const result =
                    JobApplicationScoreUtil.getFormattedJobApplicationScore(
                        score,
                        scoreType,
                    );

                // Assert
                expect(result).toEqual(expected);
            },
        );
    });
});
