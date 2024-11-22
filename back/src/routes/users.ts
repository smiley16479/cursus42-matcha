import express, { Request, Response } from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import * as crypto from "node:crypto";
import { jwtAuthCheck } from '../middleware/auth';
import { createUser, getUser, loginUser, manageUploadedPicture, patchUser, removeUser, removeUserBlock, removeUserLike, removeUserPicture, resetPassword, sendResetPasswordEmail, verifyEmail, markNotificationRead, removeNotification, addNewReport, logoutUser } from '../services/users';
import { insertUser } from '../db/users';
import { EGender, ESexualPref } from '../types/shared_type/user';
import { InternalError, UserNotFoundError } from '../types/error';
import { errorHandler } from '../middleware/error';
import { getEnv } from '../util/envvars';


let router = express.Router();

/*********************************************************
 * ================== USER MANAGEMENT ====================
 *********************************************************/

router.post('/create', errorHandler(async (req: Request, res: Response) => {
    await createUser(req.body);
    res.status(200).json({
        success: true
    });
}));

router.post('/login', errorHandler(async (req: Request, res: Response) => {
    const [token, user] = await loginUser(req.body);
    res.cookie("token", token, {
        httpOnly: true,
    }).status(200).json({
        success: true,
        data: user
    });
}));

router.get('/logout', jwtAuthCheck, async (req: Request, res: Response) => {
    logoutUser(res.locals.user.id);
    res.clearCookie("token").status(200).json({
        success: true
    });
});

router.get('/seed', errorHandler(async (_req: Request, res: Response) => {
    let tab = ['f', 'm'];
    tab.forEach(async (e, i, E)=> {
        for (let idx = 0; idx < 3; idx++) {
            let g: {key: string, value : EGender}[] = []
            for (const [key, value] of Object.entries(EGender))
                g.push({key, value})
            let s: {key: string, value : ESexualPref}[] = []
            for (const [key, value] of Object.entries(ESexualPref))
                s.push({key, value})
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
    res.status(200).json({
        success: true
    });
}));

router.get('/me', jwtAuthCheck, errorHandler(async (req: Request, res: Response) => {
    const user = await getUser(parseInt(res.locals.user.id), true);
    if (!user) {
        throw new InternalError();
    } else {
        res.status(200).json({
            success: true,
            data: user
        });
    }
}));

router.get('/:id', jwtAuthCheck, errorHandler(async (req: Request, res: Response) => {
    const user = await getUser(parseInt(req.params.id), false);
    if (!user) {
        throw new UserNotFoundError();
    } else {
        res.status(200).json({
            success: true,
            data: user
        });
    }
}));

router.delete('/delete', jwtAuthCheck, errorHandler(async (req: Request, res: Response) => {
    await removeUser(res.locals.user.id);
    res.clearCookie("token").status(200).json({
        success: true
    });
}));

router.patch('/patch', jwtAuthCheck, errorHandler(async (req: Request, res: Response) => {
    await patchUser(res.locals.user.id, req.body);
    res.status(200).json({
        success: true
    });
}));

/*********************************************************
 * =========== EMAIL VERIFICATION MANAGEMENT =============
 *********************************************************/

router.get('/confirmemail/:token', errorHandler(async (req: Request, res: Response) => {
    await verifyEmail(req.params.token);
    res.status(200).json({
        success: true
    });
}));

/*********************************************************
 * ============== PASSWORD RESET MANAGEMENT ==============
 *********************************************************/

router.get('/askresetpassword/:email', errorHandler(async (req: Request, res: Response) => {
    await sendResetPasswordEmail(req.params.email);
    res.status(200).json({
        success: true
    });
}));

router.patch('/resetpassword/:token', errorHandler(async (req: Request, res: Response) => {
    await resetPassword(req.params.token, req.body);
    res.status(200).json({
        success: true
    });
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
            console.log(`error || !req.file`, error || !req.file);
            return res.end();
        }
        await manageUploadedPicture(req, res);
        res.status(200).json({
            success: true
        })
    });
}));

router.delete('/picture/delete/:pictureIndex', jwtAuthCheck, errorHandler(async (req: Request, res: Response) => {
    await removeUserPicture(res.locals.user.id, parseInt(req.params.pictureIndex));
    res.status(200).json({
        success: true
    })
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