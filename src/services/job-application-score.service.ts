import {
    HIGH_DIMENSION_THRESHOLD,
    JobApplicationScoreType,
    LOW_DIMENSION_THRESHOLD,
    TalentAcquisitionEventType,
} from '@pulsifi/constants';
import {
    FitScoreRecipesDto,
    JobApplicationQuestionnaireDto,
    ScoreData,
    TalentAcquisitionApplicationCultureScoreCaptured,
    TalentAcquisitionApplicationRoleFitscoreCaptured,
    TalentAcquisitionAssessmentScoreCalculated,
    TalentAcquisitionScoreCalculated,
} from '@pulsifi/dtos';
import { logger } from '@pulsifi/fn';
import { IEventModel, JobApplicationSkill } from '@pulsifi/interfaces';
import { Job, JobApplication, JobApplicationScore } from '@pulsifi/models';
import { QuestionnaireUtil } from '@pulsifi/shared';
import { DataSource, EntityManager, In, Not } from 'typeorm';

import { getDataSource } from '../database';
import { CognitiveScoreService } from './cognitive-score.service';
import { FitScoreService } from './fit-score.service';
import { PairwiseScoreService } from './pairwise-score.service';
import { PersonalityScoreService } from './personality-score.service';
import { PsychologyService } from './psychology.service';
import { PublisherService } from './publisher.service';

export interface SkillSource {
    [key: string]: JobApplicationSkill;
}

export class JobApplicationScoreService {
    private readonly publisherService: PublisherService =
        new PublisherService();

    constructor(private readonly dataSource: DataSource | EntityManager) {}

    async updatePairwiseScores(
        updatedBy: number,
        jobApplicationId: string,
        jobApplicationSkills: JobApplicationSkill[],
        manager: EntityManager,
    ): Promise<void> {
        const jobApplicationRepository = manager.getRepository(JobApplication);
        const jobApplication = await jobApplicationRepository.findOneOrFail({
            select: ['id', 'job_id', 'company_id'],
            where: {
                id: jobApplicationId,
                is_deleted: false,
            },
        });

        const job = (await this.getJobById(jobApplication.job_id)) as Job;

        this.validateJobHasRecipeId(job, jobApplication.job_id, true);

        const fitScoreRecipe = await PsychologyService.getFitScoreRecipeById(
            job.role_fit_recipe_id as string,
        );

        // exit pairwise function if competency is not inclusive for fit score counting
        if (!fitScoreRecipe.competency_inclusiveness) {
            logger.info(
                'This recipe do not calculate work style and work value',
                {
                    job_id: job.id,
                    role_fit_recipe: job.role_fit_recipe_id,
                },
            );
            return;
        }

        // get hard skill scores
        const hardSkillScore =
            await PairwiseScoreService.getHardSkillJobApplicationScore(
                jobApplicationSkills,
                fitScoreRecipe,
                fitScoreRecipe.id,
                jobApplicationId,
                updatedBy,
            );

        // get work experience scores
        const workExpScore =
            await PairwiseScoreService.getWorkExpJobApplicationScore(
                jobApplicationId,
                fitScoreRecipe,
                fitScoreRecipe.id,
                updatedBy,
                manager,
            );

        const jobApplicationScores = await Promise.all([
            this.updateJobApplicationScoreCreatedBy(hardSkillScore),
            this.updateJobApplicationScoreCreatedBy(workExpScore),
        ]);

        logger.info('pairwise score calculated', {
            hardSkillScore: jobApplicationScores[0],
            workExpScore: jobApplicationScores[1],
        });

        // store scores
        await manager.save(JobApplicationScore, jobApplicationScores);

        await this.sendScoreCalculatedEvent(
            TalentAcquisitionEventType.TALENT_ACQUISITION_PAIRWISE_SCORE_CALCULATED,
            jobApplication,
            jobApplicationScores,
            updatedBy,
            job.role_fit_recipe_id as string,
        );
    }

    async processAssessmentScore(
        updatedBy: number,
        jobApplicationId: string,
        assessments: JobApplicationQuestionnaireDto[],
        roleFitRecipeId?: string,
        cultureFitRecipeId?: string,
    ): Promise<void> {
        const jobApplication = await this.dataSource
            .getRepository(JobApplication)
            .findOneOrFail({
                select: ['id', 'job_id', 'company_id'],
                where: {
                    id: jobApplicationId,
                    is_deleted: false,
                },
            });

        const personalityAssessments = assessments.filter((a) =>
            QuestionnaireUtil.isPersonalityQuestionnaire(a),
        );

        const cognitiveAssessments = assessments.filter((a) =>
            QuestionnaireUtil.isCognitiveQuestionnaire(a),
        );

        const roleFitRecipe = roleFitRecipeId
            ? await PsychologyService.getFitScoreRecipeById(roleFitRecipeId)
            : undefined;

        const personalityScores = await this.processPersonalityScores(
            personalityAssessments,
            jobApplicationId,
            updatedBy,
            roleFitRecipeId,
            roleFitRecipe,
        );

        const cognitiveScores = await this.processCognitiveScores(
            cognitiveAssessments,
            jobApplicationId,
            updatedBy,
            roleFitRecipeId,
        );

        const scores = [...personalityScores, ...cognitiveScores];

        if (!scores.length) {
            return;
        }

        await this.dataSource.getRepository(JobApplicationScore).save(scores);

        await this.sendScoreCalculatedEvent(
            TalentAcquisitionEventType.TALENT_ACQUISITION_ASSESSMENTS_SCORE_CALCULATED,
            jobApplication,
            await this.excludeReasoningAverageIfIncomplete(scores),
            updatedBy,
            roleFitRecipeId,
            cultureFitRecipeId,
        );
    }

    /**
     * @description Checks if the 'reasoning_average' exists and is complete. If it's not complete, the 'reasoning_average' is excluded from the scores.
     * This is to ensure that downstream distribution calculations only consider completed 'reasoning_average'.
     * A 'reasoning_average' is considered complete if logical, numeric and verbal scores are found in database.
     * @param scores List of updated job application scores
     * @returns List of updated job application scores with 'reasoning_average' excluded if it's incomplete
     */
    private async excludeReasoningAverageIfIncomplete(
        scores: JobApplicationScore[],
    ): Promise<JobApplicationScore[]> {
        const reasoningAverageScore = scores.find(
            (score) =>
                score.score_type === JobApplicationScoreType.REASONING_AVG,
        );

        if (!reasoningAverageScore) {
            return scores;
        }

        const cognitiveScoreCount = await this.dataSource
            .getRepository(JobApplicationScore)
            .count({
                where: {
                    job_application_id:
                        reasoningAverageScore.job_application_id,
                    score_type: In([
                        JobApplicationScoreType.REASONING_LOGICAL,
                        JobApplicationScoreType.REASONING_NUMERIC,
                        JobApplicationScoreType.REASONING_VERBAL,
                    ]),
                },
            });

        const isCognitiveAverageCompleted = cognitiveScoreCount >= 3;

        if (!isCognitiveAverageCompleted) {
            return scores.filter(
                (score) =>
                    score.score_type !== JobApplicationScoreType.REASONING_AVG,
            );
        }

        return scores;
    }

    private async processPersonalityScores(
        assessmentResults: JobApplicationQuestionnaireDto[],
        jobApplicationId: string,
        updatedBy: number,
        recipeId?: string,
        recipe?: FitScoreRecipesDto,
    ): Promise<JobApplicationScore[]> {
        const personalityScores = PersonalityScoreService.getPersonalityScores(
            assessmentResults,
            jobApplicationId,
            updatedBy,
            recipeId,
            recipe,
        );

        return await Promise.all(
            Object.values(personalityScores).map(async (score) => {
                return await this.updateJobApplicationScoreCreatedBy(score);
            }),
        );
    }

    private async processCognitiveScores(
        assessmentResults: JobApplicationQuestionnaireDto[],
        jobApplicationId: string,
        updatedBy: number,
        recipeId?: string,
    ): Promise<JobApplicationScore[]> {
        const cognitiveScores = await CognitiveScoreService.getCognitiveScores(
            assessmentResults,
            jobApplicationId,
            updatedBy,
            recipeId,
        );

        return await Promise.all(
            cognitiveScores.map(async (score) => {
                return await this.updateJobApplicationScoreCreatedBy(score);
            }),
        );
    }

    private async updateJobApplicationScoreCreatedBy(
        newScore: JobApplicationScore,
    ): Promise<JobApplicationScore> {
        const { id: jobApplicationScoreId, createdBy } =
            await this.getJobApplicationScoreIdAndCreatedBy(
                newScore.job_application_id,
                newScore.score_type,
                newScore.updated_by,
            );

        return {
            ...newScore,
            id: jobApplicationScoreId,
            created_by: createdBy,
        };
    }

    private async getJobApplicationScoreIdAndCreatedBy(
        jobApplicationId: string,
        scoreType: JobApplicationScoreType,
        updatedBy: number,
    ): Promise<{
        id?: number;
        createdBy: number;
    }> {
        const jobApplicationScore = await this.dataSource
            .getRepository(JobApplicationScore)
            .findOne({
                where: {
                    job_application_id: jobApplicationId,
                    score_type: scoreType,
                },
                select: ['id', 'created_by'],
            });

        return {
            id: jobApplicationScore?.id,
            createdBy: jobApplicationScore?.created_by ?? updatedBy,
        };
    }

    private async sendScoreCalculatedEvent(
        eventType:
            | TalentAcquisitionEventType.TALENT_ACQUISITION_PAIRWISE_SCORE_CALCULATED
            | TalentAcquisitionEventType.TALENT_ACQUISITION_ASSESSMENTS_SCORE_CALCULATED,
        jobApplication: JobApplication,
        jobApplicationScores: JobApplicationScore[],
        createdBy: number,
        roleFitRecipeId?: string,
        cultureFitRecipeId?: string,
    ): Promise<void> {
        const data = new TalentAcquisitionScoreCalculated(
            jobApplication.job_id,
            jobApplication.id,
            jobApplicationScores as ScoreData[],
            roleFitRecipeId,
            cultureFitRecipeId,
        );

        const message: IEventModel<TalentAcquisitionAssessmentScoreCalculated> =
            {
                event_type: eventType,
                event_id: jobApplication.job_id,
                company_id: jobApplication.company_id,
                user_account_id: createdBy,
                data,
            };

        await this.publisherService.sendMessage(message);
    }

    static getScoreDimension(score: number): number {
        if (score >= HIGH_DIMENSION_THRESHOLD) {
            return 2;
        }
        if (score <= LOW_DIMENSION_THRESHOLD) {
            return 0;
        }
        return 1;
    }

    async getAllScoresByJobApplication(
        jobApplicationId: string,
    ): Promise<JobApplicationScore[]> {
        const dataSource = await getDataSource();

        return await dataSource.getRepository(JobApplicationScore).find({
            where: {
                job_application_id: jobApplicationId,
                score_type: Not(JobApplicationScoreType.REASONING_AVG),
            },
        });
    }

    async getJobById(jobId: string): Promise<Job | null> {
        return await this.dataSource.getRepository(Job).findOne({
            select: ['role_fit_recipe_id', 'culture_fit_recipe_id', 'skills'],
            where: {
                id: jobId,
            },
        });
    }

    private getFitScoreRecipe(recipeId: string): Promise<FitScoreRecipesDto> {
        return PsychologyService.getFitScoreRecipeById(recipeId);
    }

    async updateFitScore(
        jobApplicationId: string,
        updatedBy: number,
        roleFitRecipeId?: string,
        cultureFitRecipeId?: string,
    ): Promise<void> {
        const jobApplicationScores = await this.getAllScoresByJobApplication(
            jobApplicationId,
        );

        const partialJobApplication: Partial<JobApplication> = {
            updated_by: updatedBy,
        };
        const updateJobApplicationScores: JobApplicationScore[] = [];

        const roleFitJobApplicationScore =
            await this.createFitJobApplicationScore(
                JobApplicationScoreType.ROLE_FIT,
                jobApplicationId,
                jobApplicationScores,
                updatedBy,
                roleFitRecipeId,
            );

        if (roleFitJobApplicationScore) {
            partialJobApplication.role_fit_score =
                roleFitJobApplicationScore.score as number;
            updateJobApplicationScores.push(
                await this.updateJobApplicationScoreCreatedBy(
                    roleFitJobApplicationScore,
                ),
            );
        }

        const cultureFitJobApplicationScore =
            await this.createFitJobApplicationScore(
                JobApplicationScoreType.CULTURE_FIT,
                jobApplicationId,
                jobApplicationScores,
                updatedBy,
                cultureFitRecipeId,
            );

        if (cultureFitJobApplicationScore) {
            partialJobApplication.culture_fit_score =
                cultureFitJobApplicationScore.score as number;
            updateJobApplicationScores.push(
                await this.updateJobApplicationScoreCreatedBy(
                    cultureFitJobApplicationScore,
                ),
            );
        }

        if (!updateJobApplicationScores.length) {
            return;
        }

        await this.dataSource.transaction(async (manager) => {
            await manager.save(JobApplicationScore, updateJobApplicationScores);

            await manager.update(
                JobApplication,
                { id: jobApplicationId },
                partialJobApplication,
            );
        });

        const jobApplication = await this.dataSource
            .getRepository(JobApplication)
            .findOneOrFail({
                where: {
                    id: jobApplicationId,
                },
                select: [
                    'id',
                    'company_id',
                    'job_id',
                    'source',
                    'ext_reference_id',
                ],
            });

        if (roleFitJobApplicationScore) {
            await this.sendRoleFitScoreCapturedEvent(
                jobApplication,
                roleFitJobApplicationScore,
            );
        }
        if (cultureFitJobApplicationScore) {
            await this.sendCultureFitScoreCapturedEvent(
                jobApplication,
                cultureFitJobApplicationScore,
            );
        }
    }

    private async createFitJobApplicationScore(
        scoreType:
            | JobApplicationScoreType.ROLE_FIT
            | JobApplicationScoreType.CULTURE_FIT,
        jobApplicationId: string,
        jobApplicationScores: JobApplicationScore[],
        updatedBy: number,
        recipeId?: string,
    ): Promise<JobApplicationScore | undefined> {
        if (!recipeId) {
            return;
        }

        const recipe = await this.getFitScoreRecipe(recipeId);

        const getFitScore =
            scoreType === JobApplicationScoreType.ROLE_FIT
                ? FitScoreService.getRoleFitJobApplicationScore
                : FitScoreService.getCultureFitJobApplicationScore;

        return getFitScore(
            jobApplicationScores,
            recipe,
            recipeId,
            jobApplicationId,
            updatedBy,
        );
    }

    private async sendRoleFitScoreCapturedEvent(
        jobApplication: JobApplication,
        jobApplicationScore: JobApplicationScore,
    ): Promise<void> {
        const data = new TalentAcquisitionApplicationRoleFitscoreCaptured(
            jobApplication,
            jobApplicationScore,
        );

        const message: IEventModel<TalentAcquisitionApplicationRoleFitscoreCaptured> =
            {
                event_type:
                    TalentAcquisitionEventType.TALENT_ACQUISITION_APPLICATION_ROLE_FIT_SCORE_CAPTURED,
                event_id: jobApplication.id,
                company_id: jobApplication.company_id,
                user_account_id: jobApplicationScore.updated_by,
                data,
            };

        await this.publisherService.sendMessage(message);
    }

    private async sendCultureFitScoreCapturedEvent(
        jobApplication: JobApplication,
        jobApplicationScore: JobApplicationScore,
    ): Promise<void> {
        const data = new TalentAcquisitionApplicationCultureScoreCaptured(
            jobApplication,
            jobApplicationScore,
        );
        const message: IEventModel<TalentAcquisitionApplicationCultureScoreCaptured> =
            {
                event_type:
                    TalentAcquisitionEventType.TALENT_ACQUISITION_APPLICATION_CULTURE_FIT_SCORE_CAPTURED,
                event_id: jobApplication.id,
                company_id: jobApplication.company_id,
                user_account_id: jobApplicationScore.updated_by,
                data,
            };
        await this.publisherService.sendMessage(message);
    }

    private validateJobHasRecipeId(
        job: Job | null,
        jobId: string,
        shouldValidateRoleFitRecipeId: boolean,
    ) {
        if (shouldValidateRoleFitRecipeId && !job?.role_fit_recipe_id) {
            throw new Error(
                `Phase 1 Fit Score Comparison. Missing role fit recipe id in job, job id: ${jobId}`,
            );
        }

        if (!shouldValidateRoleFitRecipeId && !job?.culture_fit_recipe_id) {
            throw new Error(
                `Phase 1 Fit Score Comparison. Missing culture fit recipe id in job, job id: ${jobId}`,
            );
        }
    }
}
