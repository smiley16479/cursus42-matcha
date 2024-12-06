import { insertChat, insertMessage, retrieveChatFromUsers } from "../db/chats";
import { retrieveUserBlockFromUsers } from "../db/users";
import { InternalError } from "../types/error";
import { EChatStatus, MsgInput_t } from "../types/shared_type/msg";

export async function createChat(user1Id: number, user2Id: number) {
    const chatId = await insertChat(user1Id, user2Id);
    if (chatId)
        return chatId;
    else
        throw new InternalError();
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