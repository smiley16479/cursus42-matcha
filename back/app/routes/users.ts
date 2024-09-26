import express, { Request, Response } from 'express';
import multer from 'multer';
import * as crypto from "node:crypto";
import { jwtAuthCheck } from '../middleware/auth';
import { createUser, getUser, loginUser, manageUploadedPicture, patchUser, removeUser, removeUserPicture, resetPassword, sendResetPasswordEmail, verifyEmail } from '../services/users';


var router = express.Router();

/*********************************************************
 * ================== USER MANAGEMENT ====================
 *********************************************************/

router.post('/create', async function (req: Request, res: Response) {
    try {
        await createUser(req.body);
        res.status(200).json({
            "status": "200"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            "status": "400"
        });
    }
});

router.post('/login', async function (req: Request, res: Response) {
    try {
        const token = await loginUser(req.body);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
        }).status(200).json({
            "status": "200"
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({
            "status": "403"
        });
    }
});

router.get('/logout', jwtAuthCheck, async function (req: Request, res: Response) {
    res.clearCookie("token").status(200).json({
        "status": "200"
    });
});


router.get('/:id', jwtAuthCheck, async function (req: Request, res: Response) {
    const user = await getUser(parseInt(req.params.id));

    if (!user) {
        res.status(404).json({
            "status": "404"
        });
    } else {
        res.status(200).json(user);
    }
});

router.delete('/delete', jwtAuthCheck, async function (req: Request, res: Response) {
    try {
        await removeUser(res.locals.user.id);
        res.status(200).json({
            "status": "200"
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            "status": "404"
        });
    }
});

router.patch('/patch', jwtAuthCheck, async function (req: Request, res: Response) {
    try {
        await patchUser(res.locals.user.id, req.body);
        res.status(200).json({
            "status": "200"
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            "status": "404"
        });
    }
});

/*********************************************************
 * =========== EMAIL VERIFICATION MANAGEMENT =============
 *********************************************************/

router.get('/confirmemail/:token', async function (req: Request, res: Response) {
    try {
        await verifyEmail(req.params.token);
        res.status(200).json({
            "status": "200"
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({
            "status": "403"
        });
    }
});

/*********************************************************
 * ============== PASSWORD RESET MANAGEMENT ==============
 *********************************************************/

router.get('/askresetpassword/:email', async function (req: Request, res: Response) {
    try {
        await sendResetPasswordEmail(req.params.email);
        res.status(200).json({
            "status": "200"
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({
            "status": "403"
        });
    }
});

router.patch('/resetpassword/:token', async function (req: Request, res: Response) {
    try {
        await resetPassword(req.params.token, req.body);
        res.status(200).json({
            "status": "200"
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({
            "status": "403"
        });
    }
});

/*********************************************************
 * ================ PICTURE MANAGEMENT ===================
 *********************************************************/

const uploadDir = process.env.UPLOAD_DIR;

if (!uploadDir)
    throw new Error();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const newFilename = crypto.randomBytes(20).toString('hex');
        cb(null, newFilename);
    }
});

const uploadMiddleware = multer({ storage }).single("picture");

router.post('/picture/upload', jwtAuthCheck, async function (req: Request, res: Response) {
    uploadMiddleware(req, res, async function(error) {
        if (error) {
            console.log(error);
            res.status(400).json({
                "status": "400"
            });
            return;
        }
        try {
            await manageUploadedPicture(req, res);
            res.status(200).json({
                "status": "200"
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                "status": "400"
            })
        }

    });
});

router.get('/picture/delete/:pictureIndex', jwtAuthCheck, async function (req: Request, res: Response) {
    try {
        await removeUserPicture(res.locals.user.id, parseInt(req.params.pictureIndex));
        res.status(200).json({
            "status": "200"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            "status": "400"
        })
    }
})

// Pictures are served as static files in index.ts

export default router;