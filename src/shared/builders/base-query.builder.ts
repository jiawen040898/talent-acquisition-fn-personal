import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

export abstract class BaseQueryBuilder<T extends ObjectLiteral> {
    protected readonly builder: SelectQueryBuilder<T>;

    constructor(
        private readonly repository: Repository<T>,
        protected readonly alias: string,
    ) {
        this.builder = this.repository.createQueryBuilder(alias);
    }

    build(): SelectQueryBuilder<T> {
        return this.builder;
    }
}
