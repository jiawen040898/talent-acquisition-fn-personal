export interface IEventModel<T> {
    event_type: string;
    company_id: number;
    user_account_id: number;
    timestamp?: Date;
    event_id: string;
    data: T;
}
