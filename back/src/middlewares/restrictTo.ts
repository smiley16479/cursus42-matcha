import { NextFunction, Request, Response } from 'express';
import { User } from '../models';
import { ForbiddenError } from '../errors';
import { RoleCodes } from '../models/role.model';

export const restrictTo = (...allowedRoles: RoleCodes[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user as User | undefined;

        if (!allowedRoles.includes(user?.role || '' as RoleCodes)) {
            return next(new ForbiddenError());
        }
    
        next();
    };

export const restrictCSETo = (...allowedRoles: RoleCodes[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user as User | undefined;

        if (!allowedRoles.includes(user?.role || '' as RoleCodes) || !(user?.isStaffRepresentative)) {
            return next(new ForbiddenError());
        }

        next();
};
