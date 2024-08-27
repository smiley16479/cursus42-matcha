import express, { Request, Response, NextFunction } from 'express';
import { createUser } from '../services/users';
import { retrieveUserFromId } from '../db/users';

var router = express.Router();

router.post('/create', function (req: Request, res: Response, next: NextFunction) {
    try {
        createUser(req.body)
    } catch (e) {
        res.status(400).json({
            "status": "400"
        });
    }
    res.status(200).json({
        "status": "200"
    });
});

router.get('/get/:id', (req: Request, res: Response) => {

    retrieveUserFromId(parseInt(req.params.id)).then((user) => {
        console.log(user);
        res.status(200).json(user);
    })
})

export default router;