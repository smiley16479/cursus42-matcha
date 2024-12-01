import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import multer from 'multer';
import * as crypto from "node:crypto";
import { insertUser } from '../db/users';
import { jwtAuthCheck } from '../middleware/auth';
import { errorHandler } from '../middleware/error';
import { createUser, getUser, loginUser, logoutUser, manageUploadedPicture, patchUser, removeUser, removeUserPicture, resetPassword, sendResetPasswordEmail, verifyEmail } from '../services/users';
import { InternalError, ValidationError } from '../types/error';
import { EGender, ESexualPref } from '../types/shared_type/user';
import { getEnv } from '../util/envvars';
import { askResetPasswordValidator, createUserValidator, deletePictureValidator, getUserValidator, loginValidator, patchUserValidator } from '../validators/users';


let router = express.Router();

/*********************************************************
 * ================== USER MANAGEMENT ====================
 *********************************************************/

router.post('/create', createUserValidator, errorHandler(async (req: Request, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
        throw new ValidationError(validationErrors.array());

    await createUser(req.body);

    res.sendStatus(200);
}));

router.post('/login', loginValidator, errorHandler(async (req: Request, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
        throw new ValidationError(validationErrors.array());

    const [token, user] = await loginUser(req.body);

    const exp = getEnv("JWT_EXP")
    res.cookie("token", token, {
        httpOnly: false,
        sameSite: 'lax',
        maxAge: parseInt(exp) * 60 *60 * 1000,
    }).status(200).json(user);
}));

router.get('/logout', jwtAuthCheck, async (req: Request, res: Response) => {
    logoutUser(res.locals.user.id);
    res.clearCookie("token").sendStatus(200);
});

router.get('/seed', errorHandler(async (_req: Request, res: Response) => {
    let tab = ['f', 'm'];
    tab.forEach(async (e, i, E) => {
        for (let idx = 0; idx < 3; idx++) {
            let g: { key: string, value: EGender }[] = []
            for (const [key, value] of Object.entries(EGender))
                g.push({ key, value })
            let s: { key: string, value: ESexualPref }[] = []
            for (const [key, value] of Object.entries(ESexualPref))
                s.push({ key, value })
            const name = e + i.toString() + idx.toString();
            await insertUser({
                email: "email",
                emailVerified: true,
                userName: e + "_" + s[idx].value,
                firstName: name,
                lastName: name,
                password: await bcrypt.hash("test", 10),
                gender: g[i].value,
                sexualPref: s[idx].value,
                age: 25,
                biography: "biography",
                fameRate: 0,
                latitude: 0,
                longitude: 0,
                lastConnection: new Date(),
                profileVisibility: true,
                emailNotifications: false,
                maxDistance: 50,
                matchAgeMin: 18,
                matchAgeMax: 30
            });
        }
    })
    res.sendStatus(200);
}));

router.get('/me', jwtAuthCheck, errorHandler(async (req: Request, res: Response) => {
    const user = await getUser(parseInt(res.locals.user.id), true);
    res.status(200).json(user);
}));

router.get('/:id', jwtAuthCheck, getUserValidator, errorHandler(async (req: Request, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
        throw new ValidationError(validationErrors.array());

    const user = await getUser(parseInt(req.params.id), false);

    res.status(200).json(user);
}));

router.delete('/delete', jwtAuthCheck, errorHandler(async (req: Request, res: Response) => {
    await removeUser(res.locals.user.id);
    res.clearCookie("token").sendStatus(200);
}));

router.patch('/patch', patchUserValidator, jwtAuthCheck, errorHandler(async (req: Request, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
        throw new ValidationError(validationErrors.array());

    await patchUser(res.locals.user.id, req.body);

    res.sendStatus(200);
}));

/*********************************************************
 * =========== EMAIL VERIFICATION MANAGEMENT =============
 *********************************************************/

router.get('/confirmemail/:token', errorHandler(async (req: Request, res: Response) => {
    await verifyEmail(req.params.token);
    res.sendStatus(200);
}));

/*********************************************************
 * ============== PASSWORD RESET MANAGEMENT ==============
 *********************************************************/

router.get('/askresetpassword/:email', askResetPasswordValidator, errorHandler(async (req: Request, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
        throw new ValidationError(validationErrors.array());

    await sendResetPasswordEmail(req.params.email);

    res.sendStatus(200);
}));

router.patch('/resetpassword/:token', errorHandler(async (req: Request, res: Response) => {
    await resetPassword(req.params.token, req.body);
    res.sendStatus(200);
}));

/*********************************************************
 * ================ PICTURE MANAGEMENT ===================
 *********************************************************/

const uploadDir = getEnv("UPLOAD_DIR");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const newFilename = crypto.randomBytes(20).toString('hex');
        cb(null, newFilename);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10000000 }, // 10 Mo
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        if (filetypes.test(file.mimetype))
            cb(null, true);
        else
            cb(null, false);
    }
});
const uploadMiddleware = upload.single("picture");

router.post('/picture/upload', jwtAuthCheck, errorHandler(async (req: Request, res: Response) => {
    uploadMiddleware(req, res, async function (error) {
        if (error || !req.file) {
            throw new InternalError();
        }
        await manageUploadedPicture(req, res);
        res.sendStatus(200);
    });
}));

router.delete('/picture/delete/:pictureIndex', deletePictureValidator, jwtAuthCheck, errorHandler(async (req: Request, res: Response) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
        throw new ValidationError(validationErrors.array());

    await removeUserPicture(res.locals.user.id, parseInt(req.params.pictureIndex));

    res.sendStatus(200);
}));

// Pictures are served as static files in index.ts


/****** Debug routes *******/

// router.post('/addvisit', async function (req: Request, res: Response) {
//     await addNewUserVisit(req.body.visitedUserId, req.body.visiterUserId);
//     res.status(200).send();
// })

// router.post('/addlike', async function (req: Request, res: Response) {
//     await addNewUserLike(req.body.likedUserId, req.body.likerUserId);
//     res.status(200).send();
// })

// router.post('/removeLike', async function (req: Request, res: Response) {
//     await removeUserLike(req.body.likedUserId, req.body.likerUserId);
//     res.status(200).send();
// })

// router.post('/addBlock', async function (req: Request, res: Response) {
//     await addNewBlock(req.body.blockedUserId, req.body.blockerUserId);
//     res.status(200).send();
// })

// router.post('/removeBlock', async function (req: Request, res: Response) {
//     await removeUserBlock(req.body.blockedUserId, req.body.blockerUserId);
//     res.status(200).send();
// })

// router.post('/addReport', async function (req: Request, res: Response) {
//     await addNewReport(req.body.reportedUserId, req.body.reporterUserId);
//     res.status(200).send();
// })

// router.post('/addnotification', async function (req: Request, res: Response) {
//     await addNewNotification(req.body.userId, req.body.involvedUserId, string2Notif_t_E(req.body.type));
//     res.status(200).send();
// })

// router.get('/markNotificationRead/:notifId', async function (req: Request, res: Response) {
//     await markNotificationRead(parseInt(req.params.notifId));
//     res.status(200).send();
// })

// router.get('/removenotification/:notifId', async function (req: Request, res: Response) {
//     await removeNotification(parseInt(req.params.notifId));
//     res.status(200).send();
// })

export default router;