import { Server, Socket } from 'socket.io';
import type { MsgInput_t } from '../types/shared_type/msg';
import { connectedUser } from '../util/io.utils';
import jwt from 'jsonwebtoken';
import { getEnv } from '../util/envvars';
import { addNewBlock, addNewNotification, addNewReport, addNewUserLike, addNewUserVisit, removeUserBlock, removeUserLike, toggleBlock } from '../services/users';
import { createMessage } from '../services/chats';
import { Notif_t_E } from '../types/shared_type/notification';
import { UserLiking_t } from '../types/shared_type/user';

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
    console.log("A user connected: ", socket.user.id,
                "socket.handshake.headers", socket.handshake.headers.token,
                "the user joined his id's room", 
                );
    connectedUser.push(socket.user.id);
    socket.join(`room_${socket.user.id}`)

    socket.on("error", (error) => {
      console.error("Socket error:", error.message);
    });

    socket.on('c_joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} a rejoint la room ${roomId}`);
    });

    socket.on('c_visit', async (visitedUserId, callback) => {
      console.log(`C_VISIT: visiterUserId ${socket.user.id}, visitedUserId ${visitedUserId}`);
      try {

        if (!visitedUserId)
          throw Error(`visitedUserId: ${visitedUserId}`);

        const userVisit = await addNewUserVisit(visitedUserId, socket.user.id);

        if (connectedUser.includes(visitedUserId))
          socket.to(`room_${visitedUserId}`).emit('s_visit', userVisit);

        callback({ success: true, data: userVisit });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_like', async (likedUserId, callback) => {
      console.log(`C_LIKE: likedUserId ${likedUserId}, likerUserId ${socket.user.id}`);
      try {
        if (!likedUserId)
          throw Error(`likedUserId: ${likedUserId}`);

        const like = await addNewUserLike(likedUserId, socket.user.id);
        console.log(`likedUserId obj returned`, like);
        // S'il s'agit d'un chat ou d'un like:
        const notifType = "likedUserId" in like ? Notif_t_E.LIKE : Notif_t_E.MATCH;
        const payload = "likedUserId" in like ? like : like.id;
        addNewNotification(socket.user.id, likedUserId, notifType, payload);

        if (connectedUser.includes(likedUserId))
          socket.to(`room_${likedUserId}`).emit('s_like', like);

        const userLiking: UserLiking_t = {date: new Date(), likedUserId};
        callback({ success: true, data: userLiking });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_unlike', async (unlikedUserId, callback) => {
      console.log(`C_UNLIKE: unlikedUserId ${unlikedUserId}, unlikerUserId ${unlikedUserId}`);
      try {
        await removeUserLike(unlikedUserId, socket.user.id);
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_block', async (blockedUserId, callback) => {
      console.log(`C_BLOCK: blockedUserId ${blockedUserId}, blockerUserId ${socket.user.id}`);
      try {
        await addNewBlock(blockedUserId, socket.user.id);
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_unblock', async (unblockedUserId, callback) => {
      console.log(`C_unBLOCK: unblockedUserId ${unblockedUserId}, unblockerUserId ${socket.user.id}`);
      try {
        await removeUserBlock(unblockedUserId, socket.user.id);
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_report', async (reportedUserId, callback) => {
      console.log(`C_report: reportedUserId ${reportedUserId}, reporterUserId ${socket.user.id}`);
      try {
        await addNewReport(reportedUserId, socket.user.id)
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_read_notif', async (notifId, callback) => {
      console.log(`C_read_notif_id: read_notifId ${notifId}`);
      try {
        // await markNotificationRead(notifId);
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // 👌
    socket.on('c_send_msg', async (msg: MsgInput_t, callback) => {
      console.log(`c_send_msg received`, msg);
      // Émettre le message à la room appropriée s'il y a l'autre user connecté
      try {

        if (connectedUser.includes(msg.userId))
          socket.to(`room_${msg.destId}`).emit('s_send_msg', msg);
        // io.to(`${chatId}`).emit('s_receiveMsg', message); // Ceci emet à tous
        await createMessage(msg);
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
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
      for (let i = connectedUser.length - 1; i >= 0; --i)
        if (connectedUser[i] === socket.user.id) {
          connectedUser.splice(i, 1);
          break;
        }
      console.log(`User ${socket.user.id} disconnected; socket.id: ${socket.id}`);
    });
  });
};