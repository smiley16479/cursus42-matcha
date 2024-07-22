import { NextFunction, Request, Response } from 'express';
// import { UserCreationAttributes } from '../models';
import { BadRequestError } from '../errors';
import fs from 'fs';
// import { userService } from '../services';
import { RoleCodes } from '../models/role.model';


export async function getAll(
    req: Request<{}, {}, {}, { role?: RoleCodes[], isActive?: boolean }>,
    res: Response,
    next: NextFunction
) {
    try {
        const users = null // await userService.getAll(req.query.role, req.query.isActive);

        res.status(200).json({ users });
    } catch (err: unknown) {
        next(err);
    }
}

export async function getAllWithPicture(
    req: Request<{}, {}, {}, { role?: RoleCodes[] }>,
    res: Response,
    next: NextFunction
) {
    try {
        const users = null // await userService.getAllWithPicture(req.query.role);

        res.status(200).json({ users });
    } catch (err: unknown) {
        next(err);
    }
}

export async function getAllComingSoon(req: Request, res: Response, next: NextFunction) {
    try {
        const users = null // await userService.getAllComingSoon();

        res.status(200).json({ users });
    } catch (err: unknown) {
        next(err);
    }
}

export async function getAllWithInterviews(req: Request, res: Response, next: NextFunction) {
    try {
        const users = null // await userService.getAllWithInterviews();

        res.status(200).json({ users });
    } catch (err: unknown) {
        next(err);
    }
}

export async function getByUsername(req: Request<{ username: string }>, res: Response, next: NextFunction) {
    try {
        const username = req.params.username;
        const user = null // await userService.getByUsername(username);

        res.status(200).json({ user });
    } catch (err: unknown) {
        next(err);
    }
}

export async function usernameExists(req: Request<{ username: string }>, res: Response, next: NextFunction) {
    try {
        const username = req.params.username;
        const userExists = null // await userService.usernameExists(username);

        res.status(200).json({ userExists });
    } catch (err: unknown) {
        next(err);
    }
}

export async function create(
    req: Request<{}, {}/* , UserCreationAttributes */>,
    res: Response,
    next: NextFunction
) {
    try {
        const user = null // await userService.create(req.body);

        res.status(201).json({ user });
    } catch (err: unknown) {
        next(err);
    }
}

export async function edit(
    req: Request<{ username: string }, {}/* , Partial<UserCreationAttributes> */>,
    res: Response, 
    next: NextFunction
) {
    try {
        const username = req.params.username;
        const user = null // await userService.update(username, req.body)

        res.status(200).json({ user });
    } catch (err: unknown) {
        next(err);
    }
}

export async function deleteByUsername(
    req: Request<{ username: string }>,
    res: Response,
    next: NextFunction
) {
    try {
        const username = req.params.username;
        
        // await userService.deleteByUsername(username);

        res.status(204).json();
    } catch (err: unknown) {
        next(err);
    }
}

export async function changePassword(
    req: Request<{ username: string }, {}, { oldPassword: string, newPassword: string }>,
    res: Response,
    next: NextFunction
) {
    try {
        const username = req.params.username;
        const { oldPassword, newPassword } = req.body;
        
        // await userService.updatePassword(username, oldPassword, newPassword);

        res.status(204).json();
    } catch (err: unknown) {
        next(err);
    }
}

export async function resetPassword(
    req: Request<unknown, unknown, { mail: string }>,
    res: Response,
    next: NextFunction
) {
    try {
        const mail = req.body.mail;
        
        // await userService.resetPassword(mail);

        res.status(204).json();
    } catch (err: unknown) {
        next(err);
    }
}

export async function getUserPictureByUsername(req: Request, res: Response, next: NextFunction) {
    try {
        const username = req.params.username;
        const filePath = `${process.env.UPLOAD_DIRECTORY}/${username}.jpg`;
        res.status(200).send(fs.readFileSync(filePath, 'base64'));
    } catch (err: unknown) {
        next(err);
    }
}

export async function putUserPicture(req: Request, res: Response, next: NextFunction) {
    try {
        // if (!req.file) {
        //     throw new BadRequestError('Une image est requise.');
        // }

        res.status(204).json();
    } catch (err: unknown) {
        next(err);
    }
}
