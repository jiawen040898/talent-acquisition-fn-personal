import { ModuleType } from '@pulsifi/constants';
import { Job, JobUserAccess } from '@pulsifi/models';
import { JobApplicationService, JobUserAccessService } from '@pulsifi/services';
import { minJobFieldsPayload } from '@pulsifi/tests/fixtures';
import { DataSource, Repository } from 'typeorm';

import { getTestDataSource } from '../setup';

describe('JobUserAccessService', () => {
    let jobUserAccessService: JobUserAccessService;
    let jobApplicationService: JobApplicationService;
    let dataSource: DataSource;
    let JobUserAccessRepo: Repository<JobUserAccess>;

    beforeAll(async () => {
        dataSource = await getTestDataSource();

        jobApplicationService = new JobApplicationService(dataSource);
        jobUserAccessService = new JobUserAccessService(dataSource);
        JobUserAccessRepo = dataSource.getRepository(JobUserAccess);
    });

    describe('getAccessToken', () => {
        let job: Job;
        let job2: Job;

        beforeAll(async () => {
            // Arrange
            job = await jobApplicationService.createJob({
                ...minJobFieldsPayload,
            });
            job2 = await jobApplicationService.createJob({
                ...minJobFieldsPayload,
                company_id: 2,
            });

            await JobUserAccessRepo.save({
                user_account_id: 24,
                job_id: job.id,
                created_by: 5,
                updated_by: 5,
            });
            await JobUserAccessRepo.save({
                user_account_id: 24,
                job_id: job2.id,
                created_by: 5,
                updated_by: 5,
            });
            await JobUserAccessRepo.save({
                user_account_id: 25,
                job_id: job.id,
                created_by: 5,
                updated_by: 5,
            });
            await JobUserAccessRepo.save({
                user_account_id: 25,
                job_id: job2.id,
                created_by: 5,
                updated_by: 5,
            });
        });

        it('should delete the correct job user access when user is deleted', async () => {
            // Act
            await jobUserAccessService.conditionalRemoveJobUserAccess({
                user_account_id: 24,
                company_id: job.company_id,
                updated_by: 3,
                module_roles: [
                    {
                        module_type: ModuleType.TALENT_ACQUISITION,
                        alias: 'admin',
                    },
                ],
            });

            // Assert
            const jua = await JobUserAccessRepo.find({
                where: { user_account_id: 24 },
                select: ['job_id'],
            });
            expect(jua.length).toEqual(1);
            expect(jua[0].job_id).toEqual(job2.id);
        });

        it('should not delete job user access when user change role to recruiter', async () => {
            // Act
            await jobUserAccessService.conditionalRemoveJobUserAccess({
                user_account_id: 25,
                company_id: job.company_id,
                updated_by: 3,
                module_roles: [
                    {
                        module_type: ModuleType.TALENT_ACQUISITION,
                        alias: 'recruiter',
                    },
                ],
            });

            // Assert
            const jua = await JobUserAccessRepo.find({
                where: { user_account_id: 25 },
                select: ['job_id'],
            });
            expect(jua).toEqual([{ job_id: job.id }, { job_id: job2.id }]);
        });

        it('should not prompt error if there is nothing to delete', async () => {
            // Act
            const result =
                await jobUserAccessService.conditionalRemoveJobUserAccess({
                    user_account_id: 26,
                    company_id: job.company_id,
                    updated_by: 3,
                    module_roles: [
                        {
                            module_type: ModuleType.TALENT_ACQUISITION,
                            alias: 'admin',
                        },
                    ],
                });

            // Assert
            expect(result).toBeUndefined();
        });
    });
});
