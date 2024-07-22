import { locales } from '../locales';
import { HttpError } from './http';

export class UnauthorizedError extends HttpError {
    constructor(message = locales.errors.unauthorized.default, status = 401) {
        super(message, status);
    }
}
