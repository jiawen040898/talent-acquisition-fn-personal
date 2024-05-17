import { AuditDataEntity } from '../../src/models/audit-data.entity';

const createdBy = 1;
const now = new Date();
const auditData: AuditDataEntity = {
    created_at: now,
    created_by: createdBy,
    updated_at: now,
    updated_by: createdBy,
};

export const TestData = {
    companyId: 5,
    createdBy: 1,
    createdUsername: 'Jay Pete',
    firstName: 'Jay',
    lastName: 'Pete',
    email: 'jaypete@gmail.com',
    now: new Date(),
    auditData,
};
