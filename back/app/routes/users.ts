import express, { Request, Response, NextFunction } from 'express';
import { createUser } from '../services/users';

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

export default router;