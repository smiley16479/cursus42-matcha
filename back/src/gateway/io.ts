import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { retrieveMessageFromId } from '../db/chats';
import { createMessage, prepareMessageForOutput, prepareUserChatForOutput } from '../services/chats';
import { createMatchEvent, getMatchEvent, prepareMatchEventForOutput, removeMatchEvent } from '../services/matchEvents';
import { addNewBlock, addNewNotification, addNewReport, addNewUserLike, addNewUserVisit, prepareBlockForOutput, prepareLikeForOutputForLiker, removeNotification, removeUserBlock, removeUserLike } from '../services/users';
import { IUserMatchEventDb } from '../types/matchEvents';
import { Chat_c } from '../types/shared_type/chat';
import { MatchEventOutput_t } from '../types/shared_type/matchEvents';
import type { MsgInput_t } from '../types/shared_type/msg';
import { Notif_T, Notif_t_E } from '../types/shared_type/notification';
import { UserLiking_t } from '../types/shared_type/user';
import { getEnv } from '../util/envvars';
import { connectedUser } from '../util/io.utils';
import { validateBlockInput, validateLikeInput, validateMatchEventInput, validateMsgInput, validateReadNotifInput, validateRemoveMatchEventInput, validateReportInput, validateUnblockInput, validateUnlikeInput, validateVisitInput } from '../validators/sockets';

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
    socket.join(`room_${socket.user.id}`);

    // Notif le nouveau connecté à tous les user déjà connectés
    socket.emit('s_connected_users', connectedUser );
    socket.broadcast.emit('s_user_connection', socket.user.id );

    socket.on("error", (error) => {
      console.error("Socket error:", error.message);
    });

    socket.on('c_joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} a rejoint la room ${roomId}`);
    });

    socket.on('c_visit', async (input, callback) => {
      console.log(`C_VISIT: visiterUserId ${socket.user.id}, visitedUserId ${input}`);

      const [error, visitedUserId] = validateVisitInput(input);
      if (error) {
        callback({success: false, error: error.message});
        return;
      }

      try {

        if (!visitedUserId)
          throw Error(`visitedUserId: ${visitedUserId}`);

        const userVisit = await addNewUserVisit(visitedUserId, socket.user.id);

        const notification = await addNewNotification(visitedUserId, socket.user.id, Notif_t_E.VISIT, userVisit.id);
        sendNotification(socket, visitedUserId, notification);

        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_like', async (input, callback) => {
      console.log(`C_LIKE: likedUserId ${input}, likerUserId ${socket.user.id}`);

      const [error, likedUserId] = validateLikeInput(input);
      if (error) {
        callback({success: false, error: error.message});
        return;
      }

      try {
        if (!likedUserId)
          throw Error(`likedUserId: ${likedUserId}`);

        const [chat, like] = await addNewUserLike(likedUserId, socket.user.id);

        const notification = await addNewNotification(likedUserId, socket.user.id, Notif_t_E.LIKE, like.id);
        sendNotification(socket, likedUserId, notification);

        if (chat) {
          const notification = await addNewNotification(likedUserId, socket.user.id, Notif_t_E.MATCH, chat.id);
          sendNotification(socket, likedUserId, notification);
        }

        const userLiking: UserLiking_t = prepareLikeForOutputForLiker(like);
        const outputChat: Chat_c = await prepareUserChatForOutput(chat);

        callback({ success: true, data: {newLiking: userLiking, newChat: outputChat} });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_unlike', async (input, callback) => {
      console.log(`C_UNLIKE: unlikedUserId ${input}, unlikerUserId ${socket.user.id}`);

      const [error, unlikedUserId] = validateUnlikeInput(input);
      if (error) {
        callback({success: false, error: error.message});
        return;
      }

      try {
        const [removedLikeId, blockDb] = await removeUserLike(unlikedUserId, socket.user.id);

        const notification = await addNewNotification(unlikedUserId, socket.user.id, Notif_t_E.UNLIKE, removedLikeId);
        sendNotification(socket, unlikedUserId, notification);

        const outputBlock = await prepareBlockForOutput(blockDb);

        callback({ success: true, data: {removedLikeId, newBlock: outputBlock} });
      } catch (error) {
        console.log(error);
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_block', async (input, callback) => {
      console.log(`C_BLOCK: blockedUserId ${input}, blockerUserId ${socket.user.id}`);

      const [error, blockedUserId] = validateBlockInput(input);
      if (error) {
        callback({success: false, error: error.message});
        return;
      }

      try {
        const outputBlock = await prepareBlockForOutput(await addNewBlock(blockedUserId, socket.user.id));
        callback({ success: true, data: outputBlock });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_unblock', async (input, callback) => {
      console.log(`C_unBLOCK: unblockedUserId ${input}, unblockerUserId ${socket.user.id}`);

      const [error, unblockedUserId] = validateUnblockInput(input);
      if (error) {
        callback({success: false, error: error.message});
        return;
      }

      try {
        await removeUserBlock(unblockedUserId, socket.user.id);
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_report', async (input, callback) => {
      console.log(`C_report: reportedUserId ${input}, reporterUserId ${socket.user.id}`);

      const [error, reportedUserId] = validateReportInput(input);
      if (error) {
        callback({success: false, error: error.message});
        return;
      }

      try {
        await addNewReport(reportedUserId, socket.user.id)
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_read_notif', async (input, callback) => {
      console.log(`C_read_notif_id: read_notifId ${input}`);

      const [error, notifId] = validateReadNotifInput(input);
      if (error) {
        callback({success: false, error: error.message});
        return;
      }

      try {
        removeNotification(notifId);
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('c_new_match_event', async (input, callback) => {
      console.log(`C_new_match_event: matchEvent ${JSON.stringify(input)}`);

      const [error, matchEvent] = validateMatchEventInput(input);
      if (error) {
        callback({success: false, error: error.message});
        return;
      }

      try {
        const matchEventDb: IUserMatchEventDb = await createMatchEvent(socket.user.id, matchEvent);

        const notification = await addNewNotification(matchEvent.guestId, socket.user.id, Notif_t_E.EVENT, matchEventDb.id);
        sendNotification(socket, matchEvent.guestId, notification);

        const outputMatchEvent: MatchEventOutput_t = await prepareMatchEventForOutput(matchEventDb);

        callback({ success: true, data: outputMatchEvent});
      } catch (error) {
        callback({ success: false, error: error.message});
      }
    });

    socket.on('c_remove_match_event', async (input) => {
      console.log(`C_remove_match_event: ${input}`);

      const [error, matchEventId] = validateRemoveMatchEventInput(input);
      if (error)
        return;

      try {
        const matchEventToRemove = await getMatchEvent(matchEventId);
        await removeMatchEvent(matchEventId);

        let otherUserId: number;

        if (matchEventToRemove.user1Id == socket.user.id)
          otherUserId = matchEventToRemove.user2Id;
        else
          otherUserId = matchEventToRemove.user1Id;

        const notification = await addNewNotification(otherUserId, socket.user.id, Notif_t_E.REMOVEEVENT, matchEventId)
        sendNotification(socket, otherUserId, notification);

        // callback({ success: true });
      } catch (error) {
        // callback({ success: false, error: error.message });
      }
    });

    // 👌
    socket.on('c_send_msg', async (input: MsgInput_t, callback) => {
      console.log(`c_send_msg received`, input);

      const [error, msg] = validateMsgInput(input);
      if (error) {
        callback({success: false, error: error.message});
        return;
      }

      // Émettre le message à la room appropriée s'il y a l'autre user connecté
      try {

        const msgDb = await createMessage(msg);

        if (msgDb)
          callback({ success: false, error: 'User Blocked' });

        const notification = await addNewNotification(msg.destId, socket.user.id, Notif_t_E.MSG, msgDb.id);
        sendNotification(socket, msg.destId, notification);

        const outputMessage = prepareMessageForOutput(await retrieveMessageFromId(msgDb.id));

        // if (connectedUser.includes(msg.userId))
        //   socket.to(`room_${msg.destId}`).emit('s_send_msg', msg);
        // io.to(`${chatId}`).emit('s_receiveMsg', message); // Ceci emet à tous

        callback({ success: true, data: outputMessage });
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

      // Notif la déconnexion à tous les user connectés
      socket.broadcast.emit('s_user_disconnection', socket.user.id);
      console.log(`User ${socket.user.id} disconnected; socket.id: ${socket.id}`);
    });
  });
};

async function sendNotification(socket: Socket, userId: number, notification: Notif_T) {
  if (notification && connectedUser.includes(userId))
    socket.to(`room_${userId}`).emit('s_new_notification', notification);
}