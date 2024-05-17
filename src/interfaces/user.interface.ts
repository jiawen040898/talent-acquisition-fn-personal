export interface IModuleRoleRes {
    alias: string;
    module_type: string;
    profile_id: string; // uuid
    company_id: number;
}

export interface IModuleRole {
    alias: string;
    module_type: string;
    profile_id?: string; // uuid
}

export interface ICompanyUsersRes {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    picture_url: string;
    modules_roles: IModuleRoleRes[];
}

// Object key is user account id. Object value is ICompanyUsersRes.
export type ICompanyUserResIdDict = Record<number, ICompanyUsersRes>;
