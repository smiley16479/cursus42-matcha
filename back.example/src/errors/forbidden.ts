import { locales } from '../locales';
import { HttpError } from './http';

export class ForbiddenError extends HttpError {
    constructor(message = locales.errors.forbidden.default, status = 403) {
        super(message, status);
    }
}
