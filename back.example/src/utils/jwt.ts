import jwt, { SignOptions } from 'jsonwebtoken';
import { logger } from '../configs/logger.config';


export function signJwt(payload: object, opts: SignOptions = {}): string {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret',
        {
            ...opts,
            algorithm: 'HS256',
            expiresIn: process.env.JWT_EXP || '24h',
        }
    );
}

export function verifyJwt<T>(token: string): T | null {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret', { algorithms: ['HS256'] }) as T;
    } catch (err: unknown) {
        logger.error(err);
        return null;
    }
}
