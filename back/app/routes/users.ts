import express, { Request, Response } from 'express';
import { createUser, removeUser, getUser, patchUser, verifyEmail, sendResetPasswordEmail, resetPassword, loginUser } from '../services/users';
import { jwtAuthCheck } from '../middleware/auth';

var router = express.Router();

/*********************************************************
 * ================== USER MANAGEMENT ====================
 *********************************************************/

router.post('/create', async function(req: Request, res: Response) {
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

router.post('/login', async function(req: Request, res:Response) {
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


router.get('/:id', jwtAuthCheck, async function(req: Request, res: Response) {
    const user = await getUser(parseInt(req.params.id));

    if (!user) {
        res.status(404).json({
            "status": "404"
        });
    } else {
        res.status(200).json(user);
    }
})

router.delete('/delete', jwtAuthCheck, async function(req: Request, res: Response) {
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
})

router.patch('/patch', jwtAuthCheck, async function(req: Request, res: Response) {
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
})

/*********************************************************
 * =========== EMAIL VERIFICATION MANAGEMENT =============
 *********************************************************/

router.get('/confirmemail/:token', async function(req: Request, res: Response) {
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

router.patch('/resetpassword/:token', async function(req: Request, res: Response) {
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

export default router;