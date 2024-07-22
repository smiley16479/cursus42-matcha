import { NextFunction, Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import { locales } from '../locales';
import { HttpError } from '../errors';
import { logger } from '../configs/logger.config';


function isHttpError(err: unknown): err is HttpError {
    return typeof err === 'object' &&
            err !== null &&
            'name' in err &&
            err.name === 'HttpError';
}

function isUniqueContraintError(err: unknown): err is UniqueConstraintError {
    return typeof err === 'object' &&
            err !== null &&
            'name' in err &&
            err.name === 'SequelizeUniqueConstraintError';
}

export const errorMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (isHttpError(err)) {
        logger.warn(err.message);

        const message: any = {
            message: err.message,
        };

        if (err.detailedMessages) message.errors = err.detailedMessages;
        return res.status(err.status).json(message);
    }

    if (isUniqueContraintError(err)) {
        logger.warn(err);
        const errors = err.errors.map(e => ({ message: `La valeur '${e.value}' pour le champs '${e.path}' est déjà utilisée.` }));
        return res.status(409).json({
            message: locales.errors.uniqueConstraint.default,
            errors,
        });
    }

    logger.error(err);
    if (err instanceof Error) {
        console.log(err.name);
        return res.status(500).json({ message: err.message });
    }

    res.status(500).json(String(err) || locales.errors.internal.default);
};
