import { ValidationError } from 'express-validator';
import { HttpError } from './http';

export class BadRequestError extends HttpError {
    constructor(message: ValidationError[] | string, status = 400) {
        super(message, status);
    }
}
