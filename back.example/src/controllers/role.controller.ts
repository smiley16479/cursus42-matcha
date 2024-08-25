import { NextFunction, Request, Response } from 'express';
import { Role } from '../models/';


export async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const roles = await Role.findAll();

        res.status(200).json({ roles });
    } catch (err: unknown) {
        next(err);
    }
}
