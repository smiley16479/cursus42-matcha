import express, { Request, Response } from 'express';
import { jwtAuthCheck } from '../middleware/auth';
import { getMatchCandidates } from '../services/browse';
import { IUserOutput } from '../types/shared_type/user';


let router = express.Router();

router.post('/', jwtAuthCheck, async function (req: Request, res: Response) {
    const users: IUserOutput[] = await getMatchCandidates(res.locals.user.id, req.body);
    res.status(200).json(users);
})

export default router;