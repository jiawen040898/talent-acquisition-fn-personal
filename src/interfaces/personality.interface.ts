export interface IQuestionResp {
    id: number;
    parent_id: number;
    code: number;
    name: string;
    has_negative_score: number;
    weightage: number;
    questionnaire_id: number;
    answer_group_id: number;
    content_type_id: number;
    domain_id: number;
    trait_id: number;
    order: number;
    created_by: number;
    created_at: string;
    updated_by?: number;
    updated_at?: string;
}

export interface IQuestionnaireRes {
    id: number;
    name: string;
    internal_name: string;
    duration_minutes?: number;
    estimated_minutes?: number;
    short_instructions?: string;
    short_description?: string;
    pre_description?: string;
    post_description?: string;
    logo_url?: string;
    order: number;
    questionnaire_category_id: number;
    questionnaire_type_id?: number;
    framework?: string;
    instructions: IQuestionnaireInstructions;
    questions?: IQuestionResp[];
    is_default?: number;
    expired_at?: Date;
}
export interface IQuestionnaireInstructions {
    note: string;
    subtitle: string;
    description: string;
    introduction: string;
    instruction_items: IQuestionnaireInstructionsItem[];
}

export interface IQuestionnaireInstructionsItem {
    icon: string;
    title: string;
    subtitle: string;
}

export interface IPersonalityDescriptorSummary {
    average?: IDomainDescriptor[] | string;
    development_areas: IDomainDescriptor[];
    strengths: IDomainDescriptor[];
}

export interface IDomainDescriptor {
    descriptor?: string;
    domain_id: number;
    domain_name: string;
    domain_score?: number;
    domain_alias?: string;
    domain_order?: number;
    /** additional facets is returning this */
    dimension_type?: 'average' | 'strength' | 'development_area';
    /** main facets is returning this */
    type?: 'Average' | 'Development' | 'Strength';
    trait_descriptors?: unknown;
    dimension_overviews?: IDimensionOverview[];
    traits?: ITraitItemDto[];
}

export interface IDimensionOverview {
    trait_id: number;
    trait_alias: string;
    trait_name: string;
    trait_order?: number;
    trait_score: number;
    descriptor: string;
}

export interface ITraitItemDto {
    trait_id: number;
    trait_alias: string;
    trait_name?: string;
    trait_order?: number;
    trait_score?: number;
    question_count?: number;
    total_score?: number;
    type?: string;
    descriptor?: string;
}

export interface IPersonalityBase {
    domain_id: number;
    domain_alias: string;
    domain_score: number;
    domain_percentile?: number;
}

export interface IPersonalityTrait {
    trait_id: number;
    trait_score: number;
    trait_alias: string;
    trait_percentile?: number;
    trait_order: number;
}

export interface IPersonalityDomain extends IPersonalityBase {
    domain_order: number;
    model_type_id: number;
    traits: IPersonalityTrait[];
}

export interface IDescriptorDto {
    scores: IPersonalityDomain[] | undefined;
}

interface IDetails {
    dimension_highest_scores: IDimension[];
    dimension_non_highest_scores: unknown[];
}

interface IDimension {
    domain_id: number;
    domain_alias: string;
    domain_name: string;
    domain_order: number;
    domain_score: number;
    dimension_type?: string;
    descriptor: string;
}

export interface IProfileRiasecRes {
    summary_highest_scores: IDimension[];
    details: IDetails;
}

export interface IProfileOrgValueRes {
    summary: IDimension[];
    dimensions: IDimension[];
}

export interface IProfilePersonality {
    primary: IPersonalityDescriptorRes;
    additional: IPersonalityDescriptorRes;
}

export interface IPersonalityDescriptorRes {
    source?: string;
    summary: IPersonalityDescriptorSummary;
    dimensions: IDomainDescriptor[];
}

export interface IQuestionnaireAnswerItem {
    question_code: number;
    score: number;
}

export interface IQuestionnaireAnswer {
    questionnaire_id: number;
    scores: IQuestionnaireAnswerItem[];
}

export interface IEvaluatedQuesionnaireResultRes {
    questionnaire_category_id: number;
    result: IPersonalityDomain[];
}
