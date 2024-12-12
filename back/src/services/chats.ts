import { insertChat, insertMessage, retrieveChatFromId, retrieveChatFromUsers } from "../db/chats";
import { retrieveUserBlockFromUsers, retrieveUserFromId } from "../db/users";
import { IChatDb } from "../types/chats";
import { InternalError } from "../types/error";
import { Chat_c } from "../types/shared_type/chat";
import { EChatStatus, MsgInput_t } from "../types/shared_type/msg";
import { prepareUserForOutput } from "./users";

export async function createChat(user1Id: number, user2Id: number) {
    const chatId = await insertChat(user1Id, user2Id);
    if (chatId)
        return chatId;
    else
        throw new InternalError();
}

export async function getChat(chatId: number) {
    const chat = await retrieveChatFromId(chatId);

    return chat;
}

export async function createMessage(message: MsgInput_t) {
    const blockingUser = await retrieveUserBlockFromUsers(message.destId, message.userId);
    const blockedUser = await retrieveUserBlockFromUsers(message.userId, message.destId);
    if (blockedUser || blockingUser)
        return;

    const chat = await retrieveChatFromUsers(message.userId, message.destId);
    if (!chat.id)
        throw new InternalError();
    await insertMessage(chat.id, message.userId, message.content, EChatStatus.UNREAD);
}

export async function prepareUserChatForOutput(chatDb: IChatDb | null) {
    if (!chatDb)
        return chatDb;
    
    const user1 = prepareUserForOutput(await retrieveUserFromId(chatDb.user1Id), false);
    const user2 = prepareUserForOutput(await retrieveUserFromId(chatDb.user2Id), false);

    const outputChat: Chat_c = {
        id: chatDb.id,
        interlocutors: [user1, user2],
        msg: chatDb.msg
    }
    
    return outputChat;
}