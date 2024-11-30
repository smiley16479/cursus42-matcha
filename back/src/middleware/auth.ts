import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { getEnv } from "../util/envvars";
import { AppError } from "../types/error";
import { patchUser } from "../services/users";

export function jwtAuthCheck(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    const secret = getEnv("JWT_SECRET");
    let decoded_token: string | jwt.JwtPayload;

    if (token === undefined) {
        next(new AppError(401, 'User Not Logged In'));
        return;
    }
    decoded_token = jwt.verify(token, secret);
    res.locals.user = decoded_token;
    const promise = patchUser(res.locals.user.id, { lastConnection: new Date() });
    promise.catch(next);
    next();
}