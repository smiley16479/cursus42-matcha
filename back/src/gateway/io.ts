import { Server, Socket } from 'socket.io';

export const initSocketEvents = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('A user connected: ', socket.id);

        // Exemple d'écoute d'un message de chat
        socket.on('c_chat_message', (msg) => {
            console.log('Message received: ' + msg);
            // Réémettre le message à tous les clients
            io.emit('s_chat_message', msg);
        });

        // Gestion de la déconnexion
        socket.on('disconnect', () => {
            console.log('User disconnected: ', socket.id);
        });
    });
};