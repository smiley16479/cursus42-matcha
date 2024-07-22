import { NextFunction, Request, Response } from 'express';
// import { Contact } from '../models';


export async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const contact =  null; // await Contact.findAll();

        res.status(200).json({ contact });
    } catch (err: unknown) {
        next(err);
    }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        const contact =  null; // await Contact.findOne({where : {societyId : req.params.id}});

        res.status(200).json({ contact });
    } catch (err: unknown) {
        next(err);
    }
}
