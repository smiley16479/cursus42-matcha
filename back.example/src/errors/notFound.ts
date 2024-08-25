import { locales } from '../locales';
import { HttpError } from './http';

export class NotFoundError extends HttpError {
    constructor(message = locales.errors.notFound.default, status = 404) {
        super(message, status);
    }
}
