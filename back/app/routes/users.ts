import express, { Request, Response } from 'express';
import { createUser, removeUser, getUser, patchUser } from '../services/users';
import { IUserOutput } from '../types/user';

var router = express.Router();

router.post('/create', function (req: Request, res: Response) {
    createUser(req.body)
    res.status(200).json({
        "status": "200"
    });
});

router.get('/:id', (req: Request, res: Response) => {

    getUser(parseInt(req.params.id)).then((user: IUserOutput) => {
        res.status(200).json(user);
    })
})

router.delete('/delete/:id', (req: Request, res: Response) => {
    removeUser(parseInt(req.params.id))
    res.status(200).json({
        "status": "200"
    });
})

router.patch('/patch/:id', (req: Request, res: Response) => {
    patchUser(parseInt(req.params.id), req.body);
    res.status(200).json({
        "status": "200"
    });
})

export default router;