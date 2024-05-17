import { JobApplicationScoreType } from '@pulsifi/constants';
import { JobApplicationScore } from '@pulsifi/models';
import {
    CognitiveScoreService,
    FitScoreService,
    JobApplicationScoreService,
    PairwiseScoreService,
    PersonalityScoreService,
    PsychologyService,
    PublisherService,
} from '@pulsifi/services';
import {
    testJobApplicationBuilder,
    testJobApplicationScoreBuilder,
    testJobApplicationSkillBuilder,
    testJobBuilder,
} from '@pulsifi/tests/builders';
import {
    completedQuestionnaires,
    mockCultureFitRecipe,
    mockRoleFitRecipe,
    mockRoleFitRecipeWithCompetencyInclusiveness,
    personalityQuestionnaire,
    reasoningLogicQuestionnaire,
    reasoningNumericQuestionnaire,
    reasoningVerbalQuestionnaire,
    workInterestQuestionnaire,
    workValueQuestionnaire,
} from '@pulsifi/tests/fixtures';
import {
    allCompletedNonFitScores,
    mockCultureFitScore,
    mockGetHardSkillJobApplicationScoreOutput,
    mockGetWorkExpJobApplicationScoreOutput,
    mockRoleFitScore,
} from '@pulsifi/tests/fixtures/job-application-score/test-data';
import { getTestDataSource } from '@pulsifi/tests/setup';
import { DataSource, EntityManager, In } from 'typeorm';

import { getDataSource, setDataSource } from '../../src/database';

const mockGetFitScoreRecipeById = jest
    .fn()
    .mockResolvedValue(mockRoleFitRecipeWithCompetencyInclusiveness);
jest.spyOn(PsychologyService, 'getFitScoreRecipeById').mockImplementation(
    mockGetFitScoreRecipeById,
);

const mockGetHardSkillJobApplicationScore = jest
    .fn()
    .mockImplementation((_a, _b, _c, jobApplicationId) => {
        return {
            ...mockGetHardSkillJobApplicationScoreOutput,
            job_application_id: jobApplicationId,
        };
    });
const mockGetWorkExpJobApplicationScore = jest
    .fn()
    .mockImplementation((jobApplicationId) => {
        return {
            ...mockGetWorkExpJobApplicationScoreOutput,
            job_application_id: jobApplicationId,
        };
    });
jest.spyOn(
    PairwiseScoreService,
    'getHardSkillJobApplicationScore',
).mockImplementation(mockGetHardSkillJobApplicationScore);
jest.spyOn(
    PairwiseScoreService,
    'getWorkExpJobApplicationScore',
).mockImplementation(mockGetWorkExpJobApplicationScore);

const mockGetCognitiveScores = jest.spyOn(
    CognitiveScoreService,
    'getCognitiveScores',
);
const mockGetPersonalityScores = jest.spyOn(
    PersonalityScoreService,
    'getPersonalityScores',
);

const mockGetRoleFitJobApplicationScore = jest.spyOn(
    FitScoreService,
    'getRoleFitJobApplicationScore',
);
const mockGetCultureFitJobApplicationScore = jest.spyOn(
    FitScoreService,
    'getCultureFitJobApplicationScore',
);

const mockSendMessage = jest.fn();
jest.spyOn(PublisherService.prototype, 'sendMessage').mockImplementation(
    mockSendMessage,
);

describe('JobApplicationScoreService', () => {
    let dataSource: DataSource;
    const jobApplicationId = '00000000-0000-0000-0001-000000000001';
    const jobApplicationId2 = '00000000-0000-0000-0001-000000000002';
    const jobApplicationIdWithCompletedScores =
        '00000000-0000-0000-0001-000000000003';
    const jobApplicationIdWithoutCompleteScores =
        '00000000-0000-0000-0001-000000000004';
    const jobApplicationIdWithAllScores =
        '00000000-0000-0000-0001-000000000005';
    const jobApplicationIdWithoutCompleteCognitiveScores =
        '00000000-0000-0000-0001-000000000006';
    let jobApplicationScoreService: JobApplicationScoreService;
    let jobApplicationScores: JobApplicationScore[];

    beforeAll(async () => {
        setDataSource(await getTestDataSource());
        dataSource = await getDataSource();

        const job = testJobBuilder.build({
            id: '00000000-0000-0000-0002-000000000001',
            role_fit_recipe_id: mockRoleFitRecipe.id,
            culture_fit_recipe_id: mockRoleFitRecipe.id,
        });
        const jobApplication = testJobApplicationBuilder.build({
            id: jobApplicationId,
            job_id: job.id,
        });

        const jobApplication2 = testJobApplicationBuilder.build({
            id: jobApplicationId2,
            job_id: job.id,
        });

        const jobApplicationWithCompleteScores =
            testJobApplicationBuilder.build({
                id: jobApplicationIdWithCompletedScores,
                job_id: job.id,
            });

        const jobApplicationWithoutCompleteScores =
            testJobApplicationBuilder.build({
                id: jobApplicationIdWithoutCompleteScores,
                job_id: job.id,
            });

        // all score including fit scores
        const jobApplicationWithAllScores = testJobApplicationBuilder.build({
            id: jobApplicationIdWithAllScores,
            job_id: job.id,
        });

        const jobApplicationWithoutCompleteCognitiveScores =
            testJobApplicationBuilder.build({
                id: jobApplicationIdWithoutCompleteCognitiveScores,
                job_id: job.id,
            });

        jobApplicationScores = allCompletedNonFitScores.map((score) => {
            return testJobApplicationScoreBuilder.build({
                ...score,
                id: undefined,
                job_application_id: jobApplicationWithCompleteScores.id,
            });
        });

        const allScores = [
            ...allCompletedNonFitScores,
            mockRoleFitScore,
            mockCultureFitScore,
        ].map((score) => {
            return testJobApplicationScoreBuilder.build({
                ...score,
                id: undefined,
                job_application_id: jobApplicationWithAllScores.id,
            });
        });

        await dataSource.getRepository('Job').save(job);
        await dataSource
            .getRepository('JobApplication')
            .save([
                jobApplication,
                jobApplication2,
                jobApplicationWithCompleteScores,
                jobApplicationWithoutCompleteScores,
                jobApplicationWithAllScores,
                jobApplicationWithoutCompleteCognitiveScores,
            ]);
        await dataSource
            .getRepository('JobApplicationScore')
            .save([...jobApplicationScores, ...allScores]);

        jobApplicationScoreService = new JobApplicationScoreService(dataSource);
    });

    describe('updatePairwiseScores', () => {
        const jobApplicationSkills = [
            testJobApplicationSkillBuilder.build({
                name: 'Javascript',
            }),
            testJobApplicationSkillBuilder.build({
                name: 'Python',
            }),
            testJobApplicationSkillBuilder.build({
                name: 'Typescript',
            }),
        ];

        beforeAll(async () => {
            // Arrange
            jest.clearAllMocks();

            // Act
            await dataSource.transaction(async (manager: EntityManager) => {
                await jobApplicationScoreService.updatePairwiseScores(
                    5,
                    jobApplicationId,
                    jobApplicationSkills,
                    manager,
                );
            });
        });

        it('should call correct functions', () => {
            // Assert
            expect(
                mockGetHardSkillJobApplicationScore.mock.calls,
            ).toMatchSnapshot();
            expect(mockGetWorkExpJobApplicationScore.mock.calls[0][0]).toEqual(
                jobApplicationId,
            );
            expect(
                mockGetWorkExpJobApplicationScore.mock.calls[0][1].id,
            ).toEqual(mockRoleFitRecipe.id);
        });

        it('should update pairwise score', async () => {
            // Assert
            const scores = await dataSource
                .getRepository(JobApplicationScore)
                .find({
                    where: {
                        job_application_id: jobApplicationId,
                        score_type: In([
                            JobApplicationScoreType.HARD_SKILL,
                            JobApplicationScoreType.WORK_EXP,
                        ]),
                    },
                    order: {
                        score_type: 'ASC',
                    },
                    select: ['score_type', 'score_outcome', 'score'],
                });
            expect(scores.length).toEqual(2);
            expect(scores).toMatchSnapshot();
        });

        it('should send message', () => {
            // Assert
            expect(mockSendMessage).toHaveBeenCalled();
            expect(mockSendMessage.mock.calls).toMatchSnapshot([
                [
                    {
                        data: {
                            job_application_scores: [
                                {
                                    id: expect.any(Number),
                                    created_at: expect.anything(),
                                    updated_at: expect.anything(),
                                },
                                {
                                    id: expect.any(Number),
                                    created_at: expect.anything(),
                                    updated_at: expect.anything(),
                                },
                            ],
                        },
                    },
                ],
            ]);
        });

        it('should not duplicate scores', async () => {
            // Arrange
            jest.clearAllMocks();

            // Act
            await dataSource.transaction(async (manager: EntityManager) => {
                await jobApplicationScoreService.updatePairwiseScores(
                    5,
                    jobApplicationIdWithAllScores,
                    jobApplicationSkills,
                    manager,
                );
            });

            // Assert
            const scores = await dataSource
                .getRepository(JobApplicationScore)
                .find({
                    where: {
                        job_application_id: jobApplicationIdWithAllScores,
                        score_type: In([
                            JobApplicationScoreType.HARD_SKILL,
                            JobApplicationScoreType.WORK_EXP,
                        ]),
                    },
                    order: {
                        score_type: 'ASC',
                    },
                    select: ['score_type', 'score'],
                });
            expect(scores.length).toEqual(2);
            expect(scores).toMatchSnapshot();
        });
    });

    describe('processAssessmentScore', () => {
        const expectedEventStructure = [
            [
                {
                    data: {
                        job_application_scores: Array(7)
                            .fill(null)
                            .map(() => ({
                                id: expect.any(Number),
                                created_at: expect.anything(),
                                updated_at: expect.anything(),
                            })),
                    },
                },
            ],
        ];

        describe('when recipes are provided', () => {
            beforeAll(async () => {
                // Arrange
                jest.clearAllMocks();
                mockGetFitScoreRecipeById.mockResolvedValueOnce(
                    mockRoleFitRecipeWithCompetencyInclusiveness,
                );

                // Act
                await jobApplicationScoreService.processAssessmentScore(
                    5,
                    jobApplicationId,
                    completedQuestionnaires,
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                    mockCultureFitRecipe.id,
                );
            });

            it('should get recipe', () => {
                // Assert
                expect(mockGetFitScoreRecipeById).toHaveBeenCalledWith(
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                );
            });

            it('should correctly get scores', () => {
                // Assert
                expect(mockGetCognitiveScores).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        reasoningNumericQuestionnaire,
                        reasoningLogicQuestionnaire,
                        reasoningVerbalQuestionnaire,
                    ]),
                    jobApplicationId,
                    5,
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                );
                expect(mockGetPersonalityScores).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        personalityQuestionnaire,
                        workValueQuestionnaire,
                        workInterestQuestionnaire,
                    ]),
                    jobApplicationId,
                    5,
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                    mockRoleFitRecipeWithCompetencyInclusiveness,
                );
            });

            it('should update scores', async () => {
                // Assert
                const scores = await dataSource
                    .getRepository(JobApplicationScore)
                    .find({
                        select: [
                            'score_type',
                            'score_outcome',
                            'score_dimension',
                            'score',
                        ],
                        where: {
                            job_application_id: jobApplicationId,
                            score_type: In([
                                JobApplicationScoreType.REASONING_AVG,
                                JobApplicationScoreType.REASONING_VERBAL,
                                JobApplicationScoreType.REASONING_NUMERIC,
                                JobApplicationScoreType.REASONING_LOGICAL,
                                JobApplicationScoreType.WORK_STYLE,
                                JobApplicationScoreType.WORK_INTEREST,
                                JobApplicationScoreType.WORK_VALUE,
                            ]),
                        },
                    });
                expect(scores.length).toEqual(7);
                expect(scores).toMatchSnapshot();
            });

            it('should send message', () => {
                // Assert
                expect(mockSendMessage).toHaveBeenCalled();
                expect(mockSendMessage.mock.calls).toMatchSnapshot(
                    expectedEventStructure,
                );
            });
        });

        describe('when recipes are not provided', () => {
            beforeAll(async () => {
                // Arrange
                jest.clearAllMocks();

                // Act
                await jobApplicationScoreService.processAssessmentScore(
                    5,
                    jobApplicationId2,
                    completedQuestionnaires,
                );
            });

            it('should not get recipe', () => {
                // Assert
                expect(mockGetFitScoreRecipeById).not.toHaveBeenCalled();
            });

            it('should correctly get scores', () => {
                // Assert
                expect(mockGetCognitiveScores).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        reasoningNumericQuestionnaire,
                        reasoningLogicQuestionnaire,
                        reasoningVerbalQuestionnaire,
                    ]),
                    jobApplicationId2,
                    5,
                    undefined,
                );
                expect(mockGetPersonalityScores).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        personalityQuestionnaire,
                        workValueQuestionnaire,
                        workInterestQuestionnaire,
                    ]),
                    jobApplicationId2,
                    5,
                    undefined,
                    undefined,
                );
            });

            it('should update scores', async () => {
                // Assert
                const scores = await dataSource
                    .getRepository(JobApplicationScore)
                    .find({
                        select: [
                            'score_type',
                            'score_outcome',
                            'score_dimension',
                            'score',
                        ],
                        where: {
                            job_application_id: jobApplicationId2,
                            score_type: In([
                                JobApplicationScoreType.REASONING_AVG,
                                JobApplicationScoreType.REASONING_VERBAL,
                                JobApplicationScoreType.REASONING_NUMERIC,
                                JobApplicationScoreType.REASONING_LOGICAL,
                                JobApplicationScoreType.WORK_STYLE,
                                JobApplicationScoreType.WORK_INTEREST,
                                JobApplicationScoreType.WORK_VALUE,
                            ]),
                        },
                    });
                expect(scores.length).toEqual(7);
                expect(scores).toMatchSnapshot();
            });

            it('should send message', () => {
                // Assert
                expect(mockSendMessage).toHaveBeenCalled();
                expect(mockSendMessage.mock.calls).toMatchSnapshot(
                    expectedEventStructure,
                );
            });
        });

        describe('when scores are existed', () => {
            beforeAll(async () => {
                // Arrange
                jest.clearAllMocks();
                mockGetFitScoreRecipeById.mockResolvedValueOnce(
                    mockRoleFitRecipeWithCompetencyInclusiveness,
                );

                // Act
                await jobApplicationScoreService.processAssessmentScore(
                    5,
                    jobApplicationIdWithAllScores,
                    completedQuestionnaires,
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                    mockCultureFitRecipe.id,
                );
            });

            it('should not duplicate scores records', async () => {
                // Assert
                const scores = await dataSource
                    .getRepository(JobApplicationScore)
                    .find({
                        select: ['score_type', 'score'],
                        where: {
                            job_application_id: jobApplicationIdWithAllScores,
                            score_type: In([
                                JobApplicationScoreType.REASONING_AVG,
                                JobApplicationScoreType.REASONING_VERBAL,
                                JobApplicationScoreType.REASONING_NUMERIC,
                                JobApplicationScoreType.REASONING_LOGICAL,
                                JobApplicationScoreType.WORK_STYLE,
                                JobApplicationScoreType.WORK_INTEREST,
                                JobApplicationScoreType.WORK_VALUE,
                            ]),
                        },
                    });
                expect(scores.length).toEqual(7);
                expect(scores).toMatchSnapshot();
            });
        });

        describe('when not all cognitive scores are available', () => {
            beforeAll(async () => {
                // Arrange
                jest.clearAllMocks();
                mockGetFitScoreRecipeById.mockResolvedValueOnce(
                    mockRoleFitRecipeWithCompetencyInclusiveness,
                );

                // Act
                await jobApplicationScoreService.processAssessmentScore(
                    5,
                    jobApplicationIdWithoutCompleteCognitiveScores,
                    [reasoningNumericQuestionnaire],
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                    mockCultureFitRecipe.id,
                );
            });

            it('should update reasoning numeric and reasoning average score', async () => {
                // Assert
                const scores = await dataSource
                    .getRepository(JobApplicationScore)
                    .find({
                        select: ['score_type', 'score'],
                        where: {
                            job_application_id:
                                jobApplicationIdWithoutCompleteCognitiveScores,
                            score_type: In([
                                JobApplicationScoreType.REASONING_AVG,
                                JobApplicationScoreType.REASONING_NUMERIC,
                            ]),
                        },
                    });
                expect(scores.length).toEqual(2);
                expect(scores).toMatchSnapshot();
            });

            it('should send message without reasoning average score', () => {
                // Assert
                expect(mockSendMessage).toHaveBeenCalled();

                const jobApplicationScores: JobApplicationScore[] =
                    mockSendMessage.mock.calls[0][0]?.data
                        ?.job_application_scores;

                // only 1 job application score should be updated
                expect(jobApplicationScores.length).toEqual(1);
                // and it should be reasoning numeric instead of reasoning average
                expect(jobApplicationScores[0].score_type).toEqual(
                    JobApplicationScoreType.REASONING_NUMERIC,
                );
            });
        });
    });

    describe('updateFitScore', () => {
        describe('when all scores are available', () => {
            beforeAll(async () => {
                // Arrange
                jest.clearAllMocks();

                mockGetFitScoreRecipeById
                    .mockResolvedValueOnce(
                        mockRoleFitRecipeWithCompetencyInclusiveness,
                    )
                    .mockResolvedValueOnce(mockCultureFitRecipe);

                // Act
                await jobApplicationScoreService.updateFitScore(
                    jobApplicationIdWithCompletedScores,
                    5,
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                    mockCultureFitRecipe.id,
                );
            });

            it('should get recipe', () => {
                // Assert
                expect(mockGetFitScoreRecipeById).toHaveBeenCalledWith(
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                );
                expect(mockGetFitScoreRecipeById).toHaveBeenCalledWith(
                    mockCultureFitRecipe.id,
                );
            });

            it('should correctly get scores', () => {
                // Assert
                const roleFitParamScoreIds =
                    mockGetRoleFitJobApplicationScore.mock.calls[0][0].map(
                        (score: JobApplicationScore) => {
                            return score.id;
                        },
                    );
                const cultureFitParamScoreIds =
                    mockGetCultureFitJobApplicationScore.mock.calls[0][0].map(
                        (score: JobApplicationScore) => {
                            return score.id;
                        },
                    );
                const matchScoreIds = jobApplicationScores.map(
                    (score: JobApplicationScore) => {
                        return score.id;
                    },
                );

                expect(roleFitParamScoreIds).toEqual(
                    expect.arrayContaining(matchScoreIds),
                );
                expect(
                    mockGetRoleFitJobApplicationScore.mock.calls[0][1],
                ).toEqual(mockRoleFitRecipeWithCompetencyInclusiveness);
                expect(cultureFitParamScoreIds).toEqual(
                    expect.arrayContaining(matchScoreIds),
                );
                expect(
                    mockGetCultureFitJobApplicationScore.mock.calls[0][1],
                ).toEqual(mockCultureFitRecipe);
            });

            it('should update scores', async () => {
                // Assert
                const scores = await dataSource
                    .getRepository(JobApplicationScore)
                    .find({
                        select: [
                            'score_type',
                            'score_outcome',
                            'score_dimension',
                            'score',
                        ],
                        where: {
                            job_application_id:
                                jobApplicationIdWithCompletedScores,
                            score_type: In([
                                JobApplicationScoreType.ROLE_FIT,
                                JobApplicationScoreType.CULTURE_FIT,
                            ]),
                        },
                        order: {
                            score_type: 'ASC',
                        },
                    });

                expect(scores.length).toEqual(2);
                expect(scores).toMatchSnapshot();
            });

            it('should send event', () => {
                // Assert
                expect(mockSendMessage.mock.calls).toMatchSnapshot();
            });
        });

        describe('when scores are not ready', () => {
            beforeAll(async () => {
                // Arrange
                jest.clearAllMocks();

                mockGetFitScoreRecipeById
                    .mockResolvedValueOnce(
                        mockRoleFitRecipeWithCompetencyInclusiveness,
                    )
                    .mockResolvedValueOnce(mockCultureFitRecipe);

                // Act
                await jobApplicationScoreService.updateFitScore(
                    jobApplicationIdWithoutCompleteScores,
                    5,
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                    mockCultureFitRecipe.id,
                );
            });

            it('should get recipe', () => {
                // Assert
                expect(mockGetFitScoreRecipeById).toHaveBeenCalledWith(
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                );
                expect(mockGetFitScoreRecipeById).toHaveBeenCalledWith(
                    mockCultureFitRecipe.id,
                );
            });

            it('should not update scores', async () => {
                // Assert
                const scores = await dataSource
                    .getRepository(JobApplicationScore)
                    .find({
                        select: [
                            'score_type',
                            'score_outcome',
                            'score_dimension',
                            'score',
                        ],
                        where: {
                            job_application_id:
                                jobApplicationIdWithoutCompleteScores,
                            score_type: In([
                                JobApplicationScoreType.ROLE_FIT,
                                JobApplicationScoreType.CULTURE_FIT,
                            ]),
                        },
                        order: {
                            score_type: 'ASC',
                        },
                    });

                expect(scores.length).toEqual(0);
            });

            it('should not send event', () => {
                // Assert
                expect(mockSendMessage).not.toHaveBeenCalled();
            });
        });

        describe('when there are previously calculated fit score', () => {
            beforeAll(async () => {
                // Arrange
                jest.clearAllMocks();

                mockGetFitScoreRecipeById
                    .mockResolvedValueOnce(
                        mockRoleFitRecipeWithCompetencyInclusiveness,
                    )
                    .mockResolvedValueOnce(mockCultureFitRecipe);

                // Act
                await jobApplicationScoreService.updateFitScore(
                    jobApplicationIdWithAllScores,
                    5,
                    mockRoleFitRecipeWithCompetencyInclusiveness.id,
                    mockCultureFitRecipe.id,
                );
            });

            it('should not duplicate scores records', async () => {
                // Assert
                const scores = await dataSource
                    .getRepository(JobApplicationScore)
                    .find({
                        select: ['score_type', 'score'],
                        where: {
                            job_application_id: jobApplicationIdWithAllScores,
                            score_type: In([
                                JobApplicationScoreType.ROLE_FIT,
                                JobApplicationScoreType.CULTURE_FIT,
                            ]),
                        },
                        order: {
                            score_type: 'ASC',
                        },
                    });

                expect(scores.length).toEqual(2);
                scores.map((record) => {
                    expect(record.score).not.toEqual(9.999);
                });
            });
        });
    });
});
