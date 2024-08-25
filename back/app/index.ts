import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import initDb from './db/init';

import usersRouter from './routes/users'

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* Init database if not already done */
initDb();

/* Add here next routeurs */
app.use('/api/user', usersRouter);

/* catch 404 and forward to error handler */
app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(404).send({
        status: 404
    });
});

export default app;