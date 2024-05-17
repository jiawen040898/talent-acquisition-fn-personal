/* eslint-disable @typescript-eslint/naming-convention */

export interface ContactMethodDto {
    InternetEmailAddress_main: string;
    PostalAddress_main: SafeAny;
    Telephone_home: string;
    Telephone_mobile: string;
}

export interface StructuredResumeDto {
    ContactMethod: ContactMethodDto;
    ExecutiveSummary: string;
    PersonName: SafeAny;
    RevisionDate: string;
    lang: string;
    Nationality: string[];
    EmploymentHistory: SafeAny[];
    Competency: SafeAny[];
    PreferredPosition: string;
    DOB: string;
    EducationHistory: SafeAny[];
}

export interface PartialDaxtraS3 {
    StructuredResume: StructuredResumeDto;
    ExperienceSummary: SafeAny;
    FileStruct: SafeAny;
    src: string;
    TextResume: string;
    ParserInfo: SafeAny;
}
