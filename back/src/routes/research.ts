import express, { Request, Response } from 'express';
import { jwtAuthCheck } from '../middleware/auth';
import { IUserOutput } from '../types/shared_type/user';
import { getResearchResults } from '../services/research';
import { errorHandler } from '../middleware/error';


let router = express.Router();

router.post('/', jwtAuthCheck, errorHandler(async (req: Request, res: Response) => {
    const users: IUserOutput[] = await getResearchResults(res.locals.user.id, req.body);
    res.status(200).json({
        success: true,
        data: users
    });
}));

export default router;