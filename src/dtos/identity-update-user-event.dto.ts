import { IModuleRole } from '@pulsifi/interfaces';

export class IdentityUpdateUserEventDto {
    user_account_id!: number;
    company_id!: number;
    updated_by!: number;
    module_roles?: IModuleRole[];
}
