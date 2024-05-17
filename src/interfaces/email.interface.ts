export interface SendEmailPayload {
    changed_by: number;
    receiver_id: string;
    receiver_email: string;
    email_type_id: number;
    email_template_id?: number;
    company_slug?: string;
    company_id: number;
    send_email: boolean;
    payload: EmailVariablePayload;
}

export interface EmailVariablePayload {
    first_name: string;
    job_title: string;
    candidate_profile_link: string;
}
