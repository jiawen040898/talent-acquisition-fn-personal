import { ContactType } from '@pulsifi/constants';
import {
    CandidateAssessment,
    CandidateCareer,
    CandidateEducation,
    CandidateProfile,
    CandidateScreeningAnswer,
} from '@pulsifi/dtos';
import { objectParser } from '@pulsifi/fn';
import {
    JobApplicationAttachment,
    JobApplicationCareer,
    JobApplicationContact,
    JobApplicationEducation,
    JobApplicationQuestionnaire,
    JobApplicationResume,
    JobApplicationScreeningAnswer,
    JobScreeningQuestion,
} from '@pulsifi/models';
import {
    getFilename,
    parseNumber,
    S3FileToContactParser,
} from '@pulsifi/shared';
import AmazonS3URI from 'amazon-s3-uri';
import { DataSource, In } from 'typeorm';

export const jobApplicationMapper = {
    resumeContactMapper(
        resumeContacts: JobApplicationContact[],
        existingContacts: JobApplicationContact[],
    ): JobApplicationContact[] {
        return resumeContacts
            .filter(
                (item) =>
                    !existingContacts.some(
                        (i) =>
                            i.contact_type === item.contact_type &&
                            i.value === item.value,
                    ),
            )
            .map((c) => {
                // set resume contacts as primary if no contact type found
                if (
                    (c.contact_type == ContactType.EMAIL &&
                        !existingContacts.some(
                            (i) => i.contact_type === ContactType.EMAIL,
                        )) ||
                    (c.contact_type == ContactType.MOBILE &&
                        !existingContacts.some(
                            (i) => i.contact_type === ContactType.MOBILE,
                        ))
                ) {
                    c.is_primary = true;
                }

                return c;
            });
    },

    async screeningAnswerMapper(
        dataSource: DataSource,
        createdBy: number,
        jobApplicationId: string,
        companyId: number,
        candidateScreeningAnswers: CandidateScreeningAnswer[],
    ): Promise<[JobApplicationScreeningAnswer[], JobApplicationAttachment[]]> {
        const screeningAnswers: JobApplicationScreeningAnswer[] = [];
        const attachments: JobApplicationAttachment[] = [];
        let jobScreeningQuestions: JobScreeningQuestion[] = [];

        const jobScreeningQuestionIds = candidateScreeningAnswers.map(
            (sa) => sa.job_screening_question_id,
        );
        if (jobScreeningQuestionIds.length > 0) {
            const repo = dataSource.getRepository(JobScreeningQuestion);
            jobScreeningQuestions = await repo.find({
                select: ['id', 'question_hash_code'],
                where: {
                    id: In(jobScreeningQuestionIds),
                },
            });
        }

        candidateScreeningAnswers.forEach(
            (screeningAnswerItem: CandidateScreeningAnswer) => {
                /** if file attachment */
                if (screeningAnswerItem?.attachment_file_path) {
                    const attachmentFilePathObj = AmazonS3URI(
                        screeningAnswerItem.attachment_file_path,
                    );
                    const fileName = getFilename(
                        screeningAnswerItem.attachment_file_path,
                    );

                    const newAttachment: JobApplicationAttachment = {
                        job_application_id: jobApplicationId,
                        file_name: fileName,
                        file_path: attachmentFilePathObj.key!,
                        created_by: createdBy,
                        updated_by: createdBy,
                    };
                    if (!attachments.includes(newAttachment)) {
                        attachments.push(newAttachment);
                    }
                }

                const newScreeningAnswer: JobApplicationScreeningAnswer = {
                    job_screening_question_id:
                        screeningAnswerItem.job_screening_question_id,
                    order_no: screeningAnswerItem.order_no,
                    tag: screeningAnswerItem.tag,
                    criteria_status: screeningAnswerItem.criteria_status,
                    question: objectParser.toJSON(screeningAnswerItem.question),
                    answer: objectParser.toJSON(screeningAnswerItem.answer),
                    company_id: companyId,
                    job_application_id: jobApplicationId,
                    question_hash_code: jobScreeningQuestions.find(
                        (jsq) =>
                            jsq.id ===
                            screeningAnswerItem.job_screening_question_id,
                    )?.question_hash_code,
                    created_by: createdBy,
                    updated_by: createdBy,
                };

                if (!screeningAnswers.includes(newScreeningAnswer)) {
                    screeningAnswers.push(newScreeningAnswer);
                }
            },
        );

        return [screeningAnswers, attachments];
    },

    questionnaireMapper(
        createdBy: number,
        jobApplicationId: string,
        assessments: CandidateAssessment[],
    ): JobApplicationQuestionnaire[] {
        const questionnaires: JobApplicationQuestionnaire[] = [];

        assessments.forEach((assessment: CandidateAssessment) => {
            const newAssessment: JobApplicationQuestionnaire = {
                job_application_id: jobApplicationId,
                questionnaire_framework: assessment.questionnaire_framework,
                questionnaire_id: assessment.questionnaire_id,
                attempts: assessment.attempts || 0,
                started_at: assessment.started_at,
                completed_at: assessment.completed_at,
                question_answer_raw: assessment.question_answer_raw
                    ? objectParser.toJSON(assessment.question_answer_raw)
                    : undefined,
                result_raw: assessment.result_raw
                    ? objectParser.toJSON(assessment.result_raw)
                    : undefined,
                created_by: createdBy,
                updated_by: createdBy,
            };
            if (!questionnaires.includes(newAssessment)) {
                questionnaires.push(newAssessment);
            }
        });

        return questionnaires;
    },

    careerMapper(
        createdBy: number,
        jobApplicationId: string,
        candidateCareers: CandidateCareer[],
    ): JobApplicationCareer[] {
        const careers: JobApplicationCareer[] = [];

        candidateCareers.forEach((careerItem: CandidateCareer) => {
            const newCareer: JobApplicationCareer = {
                ...careerItem,
                job_application_id: jobApplicationId,
                created_by: createdBy,
                updated_by: createdBy,
            };
            if (!careers.includes(newCareer)) {
                delete newCareer.id;
                careers.push(newCareer);
            }
        });

        return careers;
    },

    educationMapper(
        createdBy: number,
        jobApplicationId: string,
        candidateEducations: CandidateEducation[],
    ): JobApplicationEducation[] {
        const educations: JobApplicationEducation[] = [];

        candidateEducations.forEach((educationItem: CandidateEducation) => {
            const newEducation: JobApplicationEducation = {
                ...educationItem,
                job_application_id: jobApplicationId,
                parent_id: 0,
                created_by: createdBy,
                updated_by: createdBy,
            };

            if (!educations.includes(newEducation)) {
                delete newEducation.id;
                educations.push(newEducation);
            }
        });

        return educations;
    },

    contactMapper(
        createdBy: number,
        jobApplicationId: string,
        isPrimary: boolean,
        isAnonymous: boolean,
        profile: CandidateProfile,
    ): JobApplicationContact[] {
        const contacts: JobApplicationContact[] = [];
        /** handle email */
        if (
            !isAnonymous &&
            profile.identity_provider &&
            profile.identity_value
        ) {
            const newContact: JobApplicationContact = {
                job_application_id: jobApplicationId,
                contact_type: ContactType.EMAIL,
                value: profile.identity_value,
                is_primary: isPrimary,
                created_by: createdBy,
                updated_by: createdBy,
            };
            if (!contacts.includes(newContact)) {
                contacts.push(newContact);
            }
        }

        /** handle phone */
        if (profile.phone_number) {
            const value: string = parseNumber(
                `${profile.phone_code}${profile.phone_number}`,
            );
            const newContact: JobApplicationContact = {
                job_application_id: jobApplicationId,
                contact_type: ContactType.MOBILE,
                value,
                is_primary: isPrimary,
                created_by: createdBy,
                updated_by: createdBy,
            };
            if (!contacts.includes(newContact)) {
                contacts.push(newContact);
            }
        }

        return contacts;
    },

    resumeMapper(
        createdBy: number,
        jobApplicationId: string,
        resumeFilePath: string,
        resumeOriginalFilePath: string,
        resumeContentPath: string,
    ): JobApplicationResume[] {
        const resumes: JobApplicationResume[] = [];

        /** parse resume_file_path */
        const resumePathObj = AmazonS3URI(resumeFilePath);
        const originalResumePathObj = AmazonS3URI(resumeOriginalFilePath);
        const fileName = getFilename(resumeFilePath);

        const newResume: JobApplicationResume = {
            job_application_id: jobApplicationId,
            file_name: fileName,
            file_path: resumePathObj.key!,
            original_file_path: originalResumePathObj.key!,
            content_path: resumeContentPath,
            is_primary: true,
            created_by: createdBy,
            updated_by: createdBy,
        };
        resumes.push(newResume);

        return resumes;
    },

    async resumeContentMapper(
        createdBy: number,
        jobApplicationId: string,
        resumeContentPath: string,
        ignoreContactTypes: ContactType[] = [],
    ): Promise<JobApplicationContact[]> {
        /** parse resume content_path */
        const contentPathObj = AmazonS3URI(resumeContentPath);

        let contacts: JobApplicationContact[] =
            await S3FileToContactParser.parseFile(
                createdBy,
                jobApplicationId,
                contentPathObj.bucket!,
                contentPathObj.key!,
            );

        ignoreContactTypes.forEach((i) => {
            contacts = contacts.filter((c) => c.contact_type !== i);
        });

        return contacts;
    },

    async jobApplicationResumeMapper(
        createdBy: number,
        jobApplicationId: string,
        resumeFilePath?: string | null,
        resumeContentPath?: string | null,
    ): Promise<{
        resume: JobApplicationResume | undefined;
        resumeContacts: JobApplicationContact[];
    }> {
        let resume: JobApplicationResume | undefined;
        if (resumeFilePath?.trim().length) {
            const resumePathObj = AmazonS3URI(resumeFilePath);
            const fileName = getFilename(resumeFilePath);
            resume = <JobApplicationResume>{
                job_application_id: jobApplicationId,
                file_name: fileName,
                file_path: resumePathObj.key,
                original_file_path: resumePathObj.key,
                content_path: resumeContentPath,
                is_primary: true,
                created_by: createdBy,
                updated_by: createdBy,
            };
        }

        let resumeContacts: JobApplicationContact[] = [];
        if (resumeContentPath?.trim().length) {
            resumeContacts = await jobApplicationMapper.resumeContentMapper(
                createdBy,
                jobApplicationId,
                resumeContentPath,
            );
        }

        return {
            resume,
            resumeContacts,
        };
    },
};
