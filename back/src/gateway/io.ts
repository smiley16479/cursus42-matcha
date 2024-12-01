import { Server, Socket } from 'socket.io';
import type {Msg_t} from '../types/shared_type/msg';
import { connectedUser, generateRoomId } from '../util/io.utils';
import jwt from 'jsonwebtoken';
import { getEnv } from '../util/envvars';

export const initSocketEvents = (io: Server) => {

    io.use((socket, next) => {
        const authHeader = socket.handshake.headers.token;
        if (!authHeader) {
            console.error(`Middleware Socket.IO: No cookies sent`);
            return next(new Error('No cookies sent'));
        }

        const token = (authHeader as string).split(' ')[1];
        if (!token) {
            return next(new Error('Unauthorized: No token provided'));
        }

        try {
            const payload = jwt.verify(token, getEnv("JWT_SECRET")) as {id: number};
            socket.user = payload;
            next();
        } catch (err) {
            next(new Error('Unauthorized: Invalid token'));
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('A user connected: ', socket.user.id, "socket.handshake.headers", socket.handshake.headers.token);

    socket.on('c_joinRoom', (chatId) => {
        socket.join(chatId);
        console.log(`Socket ${socket.id} a rejoint la room ${chatId}`);
    });

    socket.on('c_sendTxtMsg', (msg: Msg_t) => {
        console.log(`c_sendTxtMsg received`);
        const { chatId, content, userId } = msg;
        const message = {
            chatId,
            userId,
            content,
            createdAt: new Date().toISOString()
        };

        // Émettre le message à la room appropriée s'il y a l'autre user connecté
        socket.to(`${chatId}`).emit('s_receiveMsg', message);
        // io.to(`${chatId}`).emit('s_receiveMsg', message); // Ceci emet à tous

        // Ajouter le message à la base de données
        try {
            // saveChatMsg(message)
            // if (!chats[chatId]) {
            //     chats[chatId] = { id: chatId, messages: [] };
            // }
            // chats[chatId].messages.push(message);
        } catch (error) {
            console.log(`error`, error);
        }
    });

    socket.on('c_sendVocalMsg', (msg: string) => {
        console.log(`msg Vocal: `, msg);
    });

    // Diffuser les messages reçus pour la signalisation WebRTC
    socket.on('signal', (message) => {
        console.log('Signal reçu : ', message);
        // Envoyer le message à tous les autres clients connectés
        socket.broadcast.emit('signal', message);
    });

        // Gestion de la déconnexion
        socket.on('disconnect', () => {
            console.log('User disconnected: ', socket.id);
        });
    });
};