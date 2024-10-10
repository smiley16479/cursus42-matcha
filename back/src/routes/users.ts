import express, { Request, Response } from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import * as crypto from "node:crypto";
import { jwtAuthCheck } from '../middleware/auth';
import { addNewUserLike, addNewUserVisit, createUser, getUser, loginUser, manageUploadedPicture, patchUser, removeUser, removeUserLike, removeUserPicture, resetPassword, sendResetPasswordEmail, verifyEmail } from '../services/users';
import { insertUser } from '../db/users';
import { EGender, ESexualPref } from '../types/shared_type/user';


let router = express.Router();

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
        const [token, user] = await loginUser(req.body);
        res.cookie("token", token, {
            httpOnly: true,
        }).status(200).json({
            "status": "200",
            user
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
        const filetypes = /jpeg|jpg|png|gif|webp/;
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
            console.log(`error || !req.file`, error || !req.file);
            return res.end();
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

router.delete('/picture/delete/:pictureIndex', jwtAuthCheck, async function (req: Request, res: Response) {
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


/****** Debug routes *******/

// router.post('/addvisit', async function (req: Request, res: Response) {
//     await addNewUserVisit(req.body.visitedUserId, req.body.visiterUserId);
// })

// router.post('/addlike', async function (req: Request, res: Response) {
//     await addNewUserLike(req.body.likedUserId, req.body.likerUserId);
// })

// router.post('/removeLike', async function (req: Request, res: Response) {
//     await removeUserLike(req.body.likedUserId, req.body.likerUserId);
// })

export default router;