import { JobApplicationScreeningAnswer } from '@pulsifi/models';

export class JobApplicationScreeningAnswerDto {
    id?: number;
    job_application_id: string;
    question: JSON;
    answer: JSON;
    tag?: string;
    criteria_status: string;
    attachment_file_id?: number;
    order_no!: number;
    job_screening_question_id!: number;
    question_hash_code?: number;

    constructor(input: JobApplicationScreeningAnswer) {
        this.job_application_id = input.job_application_id;
        this.question = input.question;
        this.answer = input.answer;
        this.tag = input.tag;
        this.criteria_status = input.criteria_status;
        this.attachment_file_id = input.attachment_file_id;
        this.order_no = input.order_no;
        this.job_screening_question_id = input.job_screening_question_id;
        this.question_hash_code = input.question_hash_code;
    }
}
