import { QuestionnaireFramework } from '@pulsifi/constants';
import { QuestionnaireUtil } from '@pulsifi/shared';
import {
    personalityQuestionnaire,
    reasoningLogicQuestionnaire,
    reasoningNumericQuestionnaire,
    reasoningVerbalQuestionnaire,
    workInterestQuestionnaire,
    workValueQuestionnaire,
} from '@pulsifi/tests/fixtures';

describe('QuestionnaireUtil', () => {
    describe('isPersonalityQuestionnaireFramework', () => {
        it.each([
            {
                framework: QuestionnaireFramework.WORK_VALUE,
                expected: true,
            },
            {
                framework: QuestionnaireFramework.PERSONALITY,
                expected: true,
            },
            {
                framework: QuestionnaireFramework.WORK_INTEREST,
                expected: true,
            },
            {
                framework: QuestionnaireFramework.REASONING_LOGIC,
                expected: false,
            },
            {
                framework: QuestionnaireFramework.REASONING_VERBAL,
                expected: false,
            },
            {
                framework: QuestionnaireFramework.REASONING_NUMERIC,
                expected: false,
            },
        ])(
            `should return $expected if input is $framework`,
            ({ framework, expected }) => {
                // Act
                const isPersonality =
                    QuestionnaireUtil.isPersonalityQuestionnaireFramework(
                        framework,
                    );

                // Assert
                expect(isPersonality).toBe(expected);
            },
        );
    });

    describe('isCognitiveQuestionnaireFramework', () => {
        it.each([
            {
                framework: QuestionnaireFramework.WORK_VALUE,
                expected: false,
            },
            {
                framework: QuestionnaireFramework.PERSONALITY,
                expected: false,
            },
            {
                framework: QuestionnaireFramework.WORK_INTEREST,
                expected: false,
            },
            {
                framework: QuestionnaireFramework.REASONING_LOGIC,
                expected: true,
            },
            {
                framework: QuestionnaireFramework.REASONING_VERBAL,
                expected: true,
            },
            {
                framework: QuestionnaireFramework.REASONING_NUMERIC,
                expected: true,
            },
        ])(
            `should return $expected if input is $framework`,
            ({ framework, expected }) => {
                // Act
                const isReasoning =
                    QuestionnaireUtil.isCognitiveQuestionnaireFramework(
                        framework,
                    );

                // Assert
                expect(isReasoning).toBe(expected);
            },
        );
    });

    describe('isPersonalityQuestionnaire', () => {
        it.each([
            {
                framework: QuestionnaireFramework.WORK_VALUE,
                assessment: workValueQuestionnaire,
                expected: true,
            },
            {
                framework: QuestionnaireFramework.PERSONALITY,
                assessment: personalityQuestionnaire,
                expected: true,
            },
            {
                framework: QuestionnaireFramework.WORK_INTEREST,
                assessment: workInterestQuestionnaire,
                expected: true,
            },
            {
                framework: QuestionnaireFramework.REASONING_LOGIC,
                assessment: reasoningLogicQuestionnaire,
                expected: false,
            },
            {
                framework: QuestionnaireFramework.REASONING_VERBAL,
                assessment: reasoningVerbalQuestionnaire,
                expected: false,
            },
            {
                framework: QuestionnaireFramework.REASONING_NUMERIC,
                assessment: reasoningNumericQuestionnaire,
                expected: false,
            },
        ])(
            `should return $expected if assessment framework is $framework`,
            ({ assessment, expected }) => {
                // Act
                const isPersonality =
                    QuestionnaireUtil.isPersonalityQuestionnaire(assessment);

                // Assert
                expect(isPersonality).toEqual(expected);
            },
        );
    });

    describe('isCognitiveQuestionnaire', () => {
        it.each([
            {
                framework: QuestionnaireFramework.WORK_VALUE,
                assessment: workValueQuestionnaire,
                expected: false,
            },
            {
                framework: QuestionnaireFramework.PERSONALITY,
                assessment: personalityQuestionnaire,
                expected: false,
            },
            {
                framework: QuestionnaireFramework.WORK_INTEREST,
                assessment: workInterestQuestionnaire,
                expected: false,
            },
            {
                framework: QuestionnaireFramework.REASONING_LOGIC,
                assessment: reasoningLogicQuestionnaire,
                expected: true,
            },
            {
                framework: QuestionnaireFramework.REASONING_VERBAL,
                assessment: reasoningVerbalQuestionnaire,
                expected: true,
            },
            {
                framework: QuestionnaireFramework.REASONING_NUMERIC,
                assessment: reasoningNumericQuestionnaire,
                expected: true,
            },
        ])(
            `should return $expected if assessment framework is $framework`,
            ({ assessment, expected }) => {
                // Act
                const isCognitive =
                    QuestionnaireUtil.isCognitiveQuestionnaire(assessment);

                // Assert
                expect(isCognitive).toEqual(expected);
            },
        );
    });
});
