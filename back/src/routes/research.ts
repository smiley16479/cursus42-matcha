import express, { Request, Response } from 'express';
import { jwtAuthCheck } from '../middleware/auth';
import { IUserOutput } from '../types/shared_type/user';
import { getResearchResults } from '../services/research';
import { errorHandler } from '../middleware/error';
import { researchValidator } from '../validators/research';
import { validationResult } from 'express-validator';
import { ValidationError } from '../types/error';


let router = express.Router();

router.post('/', jwtAuthCheck, researchValidator, errorHandler(async (req: Request, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
        throw new ValidationError(validationErrors.array());

    const users: IUserOutput[] = await getResearchResults(res.locals.user.id, req.body);
    
    res.status(200).json({
        success: true,
        data: users
    });
}));

export default router;