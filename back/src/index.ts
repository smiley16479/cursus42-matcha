import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import 'dotenv/config';

import initDb from './db/init';

import usersRouter from './routes/users';
import browseRouter from './routes/browse';
import researchRouter from './routes/research';
import { jwtAuthCheck } from './middleware/auth';
import { initSocketEvents } from './gateway/io';
import { AppError, InternalError } from './types/error';

const port = 3000
const app = express();

app.use(cors({
    origin: 'http://localhost:8080', // Ne pas mettre '*' avec credentials: true
    credentials: true // permet au serveur d'accepter les requêtes avec des cookies, des sessions, ou des en-têtes d'authentification
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* Init database if not already done */
await initDb();

/* Serve static file (pictures) */
const uploadDir = process.env.UPLOAD_DIR;
if (!uploadDir)
    throw new InternalError();

app.use('/api/user/picture', jwtAuthCheck, express.static(uploadDir));

/* Add here next routeurs */
app.use('/api/user', usersRouter);
app.use('/api/browse', browseRouter);
app.use('/api/research', researchRouter);

/* catch 404 and forward to error handler */
app.use(function (req: Request, res: Response, next: NextFunction) {
    next(new InternalError())
});

/* centralized error management */

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.log(err);

    res.status(err.status).json({
        success: false,
        message: err.message
    });
});

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Initialiser les événements Socket.IO
initSocketEvents(io);

server.listen(port, ()=> {
    console.log(`App listening on port ${port}`)
})

export default app;