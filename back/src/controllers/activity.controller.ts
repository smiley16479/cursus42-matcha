import { NextFunction, Request, Response } from 'express';
import { locales } from '../locales';
import { NotFoundError } from '../errors';
import { Activity, ActivityCreationAttributes } from '../models/';


/**
 * Création d'une activité en base de données
 * @param req
 * @param res 
 * @param next 
 */
export async function create(
    req: Request<unknown, unknown, ActivityCreationAttributes>,
    res: Response,
    next: NextFunction
) {
    try {
        const activity = req.body;

        const result = await Activity.create(activity);

        res.status(201).json({ activity: result });
    } catch (err: unknown) {
        next(err);
    }
}

/**
 * 
 * @param req 
 * @param res 
 */
export async function getById(
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
) {
    try {
        const id = req.params.id;
        const activity = await Activity.findByPk(id);

        if (activity === null) {
            throw new NotFoundError(locales.errors.notFound.activity(id));
        }

        res.status(200).json({ activity });
    } catch (err: unknown) {
        next(err);
    }
}

// export async function update(req: Request, res: Response, next: NextFunction) {
//     try {
//         const id = parseInt(req.params.id);

        
//     } catch (err: unknown) {
//         next(err);
//     }
// }
