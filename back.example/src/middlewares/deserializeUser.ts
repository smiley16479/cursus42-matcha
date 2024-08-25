import { NextFunction, Request, Response } from 'express';
import { RoleCodes, User } from '../models';
import { verifyJwt } from '../utils';
import { UnauthorizedError } from '../errors';
import { locales } from '../locales';

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) throw new UnauthorizedError(locales.errors.unauthorized.withNoToken);

        const decoded = verifyJwt<{ sub: string }>(token);
        if (!decoded) throw new UnauthorizedError(locales.errors.unauthorized.withInvalidToken);

        const user = null // await User.findByPk(decoded.sub, { include: RoleCodes });
        // if (!user) throw new UnauthorizedError(locales.errors.unauthorized.withInvalidToken);

        res.locals.user = user;

        next();
    } catch (err: unknown) {
        next(err);
    }
};
