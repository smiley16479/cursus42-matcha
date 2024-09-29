import express, { Request, Response } from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import * as crypto from "node:crypto";
import { jwtAuthCheck } from '../middleware/auth';
import { createUser, getUser, loginUser, manageUploadedPicture, patchUser, removeUser, removeUserPicture, resetPassword, sendResetPasswordEmail, verifyEmail } from '../services/users';
import { insertUser } from '../db/users';
import { EGender, ESexualPref } from '../types/user';


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

router.get('/seed', async function (_req: Request, res: Response) {
    try {
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
                    username: e + "_" + s[idx].value,
                    firstName: name,
                    lastName: name,
                    gender: g[i].value,
                    sexualPref: s[idx].value,
                    biography: "biography",
                    fameRate: 0,
                    latitude: 0,
                    longitude: 0,
                    lastConnection: new Date(),
                    email: "email",
                    emailVerified: true,
                    password: await bcrypt.hash("test", 10)
                });
            }
        })
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

router.get('/me', jwtAuthCheck, async function (req: Request, res: Response) {
    try {
        const user = await getUser(parseInt(res.locals.user.id), true);
        if (!user) {
            throw new Error();
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({
            "status": "404"
        });
    }
})

router.get('/:id', jwtAuthCheck, async function (req: Request, res: Response) {
    try {
        const user = await getUser(parseInt(req.params.id), false);
        if (!user) {
            throw new Error();
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({
            "status": "404"
        });
    }
});

router.delete('/delete', jwtAuthCheck, async function (req: Request, res: Response) {
    try {
        await removeUser(res.locals.user.id);
        res.clearCookie("token").status(200).json({
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

const upload = multer({
    storage,
    limits: { fileSize: 10000000 }, // 10 Mo
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        if (filetypes.test(file.mimetype))
            cb(null, true);
        else
            cb(null, false);
    }
});
const uploadMiddleware = upload.single("picture");

router.post('/picture/upload', jwtAuthCheck, async function (req: Request, res: Response) {
    uploadMiddleware(req, res, async function (error) {
        if (error || !req.file) {
            res.status(400).json({
                "status": "400"
            });
            return res.end;
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