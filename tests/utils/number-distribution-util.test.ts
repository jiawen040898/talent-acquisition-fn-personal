import { NumberDistributionUtils } from '@pulsifi/shared';

describe('NumberDistributionUtils', () => {
    describe('distributeNumbersToMatchTargetValue', () => {
        it.each([
            [
                'increment',
                {
                    targetValue: 0.29,
                    step: 0.01,
                    dataToBeDistributed: [
                        {
                            score: 0.14623,
                        },
                        {
                            score: 0.13465,
                        },
                        {
                            score: 0,
                        },
                    ],
                    expectedDistributedData: [
                        {
                            score: 0.13465,
                            score_adjustment: 0.01,
                        },
                        {
                            score: 0,
                            score_adjustment: 0,
                        },
                        {
                            score: 0.14623,
                            score_adjustment: 0,
                        },
                    ],
                },
            ],
            [
                'increment',
                {
                    targetValue: 0.36,
                    step: 0.02,
                    dataToBeDistributed: [
                        {
                            score: 0.13623,
                        },
                        {
                            score: 0.04465,
                        },
                        {
                            score: 0.13523,
                        },
                    ],
                    expectedDistributedData: [
                        {
                            score: 0.04465,
                            score_adjustment: 0.02,
                        },
                        {
                            score: 0.13623,
                            score_adjustment: 0.02,
                        },
                        {
                            score: 0.13523,
                            score_adjustment: 0,
                        },
                    ],
                },
            ],
            [
                'decrement',
                {
                    targetValue: 0.26,
                    step: 0.02,
                    dataToBeDistributed: [
                        {
                            score: 0.14623,
                        },
                        {
                            score: 0.12465,
                        },
                        {
                            score: 0.0133,
                        },
                    ],
                    expectedDistributedData: [
                        {
                            score: 0.14623,
                            score_adjustment: -0.02,
                        },
                        {
                            score: 0.0133,
                            score_adjustment: 0,
                        },
                        {
                            score: 0.12465,
                            score_adjustment: 0,
                        },
                    ],
                },
            ],
            [
                'decrement',
                {
                    targetValue: 0.26,
                    step: 0.01,
                    dataToBeDistributed: [
                        {
                            score: 0.14623,
                        },
                        {
                            score: 0.12465,
                        },
                        {
                            score: 0.0133,
                        },
                    ],
                    expectedDistributedData: [
                        {
                            score: 0.14623,
                            score_adjustment: -0.01,
                        },
                        {
                            score: 0.0133,
                            score_adjustment: -0.01,
                        },
                        {
                            score: 0.12465,
                            score_adjustment: 0,
                        },
                    ],
                },
            ],
            [
                'no distribution',
                {
                    targetValue: 0.28,
                    step: 0.01,
                    dataToBeDistributed: [
                        {
                            score: 0.14623,
                        },
                        {
                            score: 0.13465,
                        },
                        {
                            score: 0,
                        },
                    ],
                    expectedDistributedData: [
                        {
                            score: 0.14623,
                            score_adjustment: 0,
                        },
                        {
                            score: 0,
                            score_adjustment: 0,
                        },
                        {
                            score: 0.13465,
                            score_adjustment: 0,
                        },
                    ],
                },
            ],
            [
                'increment',
                {
                    targetValue: 0.37,
                    step: 0.01,
                    dataToBeDistributed: [
                        {
                            score: 0.122,
                            weightage: 0.25,
                        },
                        {
                            score: 0.113,
                            weightage: 0.25,
                        },
                        {
                            score: 0.134,
                            weightage: 0.13,
                        },
                    ],
                    expectedDistributedData: [
                        {
                            score: 0.134,
                            score_adjustment: 0,
                        },
                        {
                            score: 0.113,
                            score_adjustment: 0.01,
                        },
                        {
                            score: 0.122,
                            score_adjustment: 0,
                        },
                    ],
                },
            ],
            [
                'decrement',
                {
                    targetValue: 0.27,
                    step: 0.01,
                    dataToBeDistributed: [
                        {
                            score: 0.14623,
                            weightage: 0.2,
                            weightage_adjustment: 0,
                        },
                        {
                            score: 0.12465,
                            weightage: 0.11,
                            weightage_adjustment: 0,
                        },
                        {
                            score: 0.0133,
                            weightage: 0.05,
                            weightage_adjustment: 0,
                        },
                    ],
                    expectedDistributedData: [
                        {
                            score: 0.12465,
                            score_adjustment: -0.01,
                        },
                        {
                            score: 0.14623,
                            score_adjustment: 0,
                        },
                        {
                            score: 0.0133,
                            score_adjustment: 0,
                        },
                    ],
                },
            ],
        ])(
            'should distribute numbers to match target value correctly by %s',
            (_, data) => {
                // Arrange
                const key = 'score';
                const assignedKey = 'score_adjustment';
                const maxScoreKey: SafeAny = 'weightage';
                const maxScoreAdjustmentKey: SafeAny = 'weightage_adjustment';

                // Act
                const result =
                    NumberDistributionUtils.distributeNumbersToMatchTargetValue(
                        data.targetValue,
                        data.dataToBeDistributed,
                        key,
                        assignedKey,
                        data.step,
                        maxScoreKey,
                        maxScoreAdjustmentKey,
                    );

                // Assert
                expect(result).toMatchObject(data.expectedDistributedData);
            },
        );
    });
});
