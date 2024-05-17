import { QuestionnaireFramework } from '@pulsifi/constants';
import { JobApplicationQuestionnaireDto } from '@pulsifi/dtos';
import { JobApplicationQuestionnaire } from '@pulsifi/models';

const isCognitiveQuestionnaireFramework = (
    frameworkType: QuestionnaireFramework,
): boolean => {
    const cognitiveFrameworks = [
        QuestionnaireFramework.REASONING_NUMERIC,
        QuestionnaireFramework.REASONING_LOGIC,
        QuestionnaireFramework.REASONING_VERBAL,
    ];

    return cognitiveFrameworks.includes(frameworkType);
};

const isPersonalityQuestionnaireFramework = (
    frameworkType: QuestionnaireFramework,
): boolean => {
    const personalityFrameworks = [
        QuestionnaireFramework.PERSONALITY, // WORK_STYLE
        QuestionnaireFramework.WORK_VALUE,
        QuestionnaireFramework.WORK_INTEREST,
    ];

    return personalityFrameworks.includes(frameworkType);
};

const isCognitiveQuestionnaire = (
    questionnaire: JobApplicationQuestionnaireDto | JobApplicationQuestionnaire,
): boolean => {
    return isCognitiveQuestionnaireFramework(
        questionnaire.questionnaire_framework as QuestionnaireFramework,
    );
};

const isPersonalityQuestionnaire = (
    questionnaire: JobApplicationQuestionnaireDto | JobApplicationQuestionnaire,
): boolean => {
    return isPersonalityQuestionnaireFramework(
        questionnaire.questionnaire_framework as QuestionnaireFramework,
    );
};

export const QuestionnaireUtil = {
    isCognitiveQuestionnaireFramework,
    isPersonalityQuestionnaireFramework,
    isCognitiveQuestionnaire,
    isPersonalityQuestionnaire,
};
