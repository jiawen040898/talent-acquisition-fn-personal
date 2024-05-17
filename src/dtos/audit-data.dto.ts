import { AuditDataEntity } from '@pulsifi/models';

export class AuditDataDto {
    created_at?: Date;
    created_by?: number;
    updated_at?: Date;
    updated_by?: number;

    constructor(dto: AuditDataEntity) {
        this.created_by = dto.created_by;
        this.updated_by = dto.updated_by;
        this.created_at = dto.created_at;
        this.updated_at = dto.updated_at;
    }
}
