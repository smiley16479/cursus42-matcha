import express, { Request, Response } from 'express';
import { createUser, removeUser, getUser, patchUser, verifyEmail } from '../services/users';

var router = express.Router();

router.post('/create', async function(req: Request, res: Response) {
    try {
        await createUser(req.body);
        res.status(200).json({
            "status": "200"
        });
    } catch (error) {
        res.status(400).json({
            "status": "400"
        });
    }
});

router.get('/confirmemail/:token', async function(req: Request, res: Response) {
    try {
        await verifyEmail(req.params.token);
        res.status(200).json({
            "status": "200"
        });
    } catch (error) {
        res.status(403).json({
            "status": "403"
        });
    }
});

router.get('/:id', async function(req: Request, res: Response) {
    const user = await getUser(parseInt(req.params.id));

    if (!user) {
        res.status(404).json({
            "status": "404"
        });
    } else {
        res.status(200).json(user);
    }
})

router.delete('/delete/:id', async function(req: Request, res: Response) {
    try {
        await removeUser(parseInt(req.params.id))
        res.status(200).json({
            "status": "200"
        });
    } catch (error) {
        res.status(404).json({
            "status": "404"
        });
    }
})

router.patch('/patch/:id', async function(req: Request, res: Response) {
    try {
        await patchUser(parseInt(req.params.id), req.body);
        res.status(200).json({
            "status": "200"
        });
    } catch (error) {
        res.status(404).json({
            "status": "404"
        });
    }
})

export default router;