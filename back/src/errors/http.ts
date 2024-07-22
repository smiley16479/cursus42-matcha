import { ValidationError } from 'express-validator';
import { locales } from '../locales';

export class HttpError extends Error {
    public readonly status: number;
    public readonly detailedMessages?: any;

    constructor(message: string | ValidationError[], status: number) {
        if (typeof message === 'string') {
            super(message);
        } else {
            super(locales.errors.badRequest.default);
        }

        this.name = 'HttpError';
        this.status = status;
        this.detailedMessages = Array.isArray(message) ? message : undefined;
    }
}
