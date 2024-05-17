export interface TextSummaryExtractedSkill {
    skill: string;
    category: string;
}

export interface TextSummaryResponse {
    is_resume: boolean;
    competencies: TextSummaryExtractedSkill[];
}

export interface TextResume {
    TextResume: string;
}
