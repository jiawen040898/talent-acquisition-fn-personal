import { JobApplicationQuestionnaire } from '@pulsifi/models';

export class JobApplicationQuestionnaireDto {
    id?: number;
    job_application_id: string;
    questionnaire_framework: string;
    questionnaire_id: number;
    started_at?: Date;
    completed_at?: Date;
    attempts!: number;
    question_answer_raw?: JSON;
    result_raw?: JSON;

    constructor(input: JobApplicationQuestionnaire) {
        this.id = input.id;
        this.job_application_id = input.job_application_id;
        this.questionnaire_framework = input.questionnaire_framework;
        this.questionnaire_id = input.questionnaire_id;
        this.started_at = input.started_at;
        this.completed_at = input.completed_at;
        this.attempts = input.attempts;
        this.question_answer_raw = input.question_answer_raw;
        this.result_raw = input.result_raw;
    }
}
