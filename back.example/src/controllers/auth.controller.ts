import { NextFunction, Request, Response } from 'express';
import { authService } from '../services';


/**
 * Connecte un utilisateur en fonction de son identifiant et mot de passe,
 * renvoie un json web token en cas de succès.
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export async function login(
    req: Request<{}, {}, { username: string, password: string }>,
    res: Response,
    next: NextFunction
) {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);

        res.status(200).json({ token });
    } catch (err: unknown) {
        next(err);
    }
}
