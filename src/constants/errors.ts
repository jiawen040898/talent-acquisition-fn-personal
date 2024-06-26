export abstract class ErrorResult extends Error {
    constructor(public description: string) {
        super(description);
    }
}

export class BadRequestResult extends ErrorResult {}

export class ConfigurationErrorResult extends ErrorResult {}

export class ForbiddenResult extends ErrorResult {}

export class InternalServerErrorResult extends ErrorResult {}

export class NotFoundResult extends ErrorResult {}
