import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export function jwtAuthCheck(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    const secret = process.env.JWT_SECRET;
        if (!secret)
        throw new Error();
    try {
        const user = jwt.verify(token, secret);
        res.locals.user = user;
        next();
    } catch (error) {
        res.clearCookie("token").status(403).json({
            "status": "403"
        });
    }
}