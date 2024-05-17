import { ModuleType, TA_ROLES_REQUIRE_ACCESS } from '@pulsifi/constants';
import { IdentityUpdateUserEventDto } from '@pulsifi/dtos';
import { Job, JobUserAccess } from '@pulsifi/models';
import { DataSource } from 'typeorm';

export class JobUserAccessService {
    constructor(private readonly dataSource: DataSource) {}

    async conditionalRemoveJobUserAccess(
        payload: IdentityUpdateUserEventDto,
    ): Promise<void> {
        payload.module_roles = payload.module_roles ?? [];

        const isAccessRequired = payload.module_roles.some(
            (role) =>
                role.module_type === ModuleType.TALENT_ACQUISITION &&
                TA_ROLES_REQUIRE_ACCESS.includes(role.alias),
        );

        if (isAccessRequired) {
            return;
        }

        await this.removeJobUserAccess(payload);
    }

    async removeJobUserAccess(
        payload: IdentityUpdateUserEventDto,
    ): Promise<void> {
        const jobUserAccessRepo = this.dataSource.getRepository(JobUserAccess);
        const jobUserAccessListToDelete = await jobUserAccessRepo
            .createQueryBuilder('jua')
            .innerJoin(Job, 'job', 'jua.job_id = job.id')
            .where('jua.user_account_id = :user_account_id', {
                user_account_id: payload.user_account_id,
            })
            .andWhere('job.company_id = :company_id', {
                company_id: payload.company_id,
            })
            .select(['jua.id'])
            .getMany();

        if (!jobUserAccessListToDelete.length) {
            return;
        }

        const juaIdToDelete = jobUserAccessListToDelete.map((jua) => jua.id);
        await jobUserAccessRepo.delete(juaIdToDelete);
    }
}
