import { Request, Response, NextFunction } from 'express';
import { validationResult, type ValidationChain } from 'express-validator';
import { BadRequestError } from '../errors';


export const validate = (validations: ValidationChain[]) => 
    async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        next(new BadRequestError(errors.array()));
    };
