import { insertChat, insertMessage } from "../db/chats";
import { InternalError } from "../types/error";
import { EChatStatus } from "../types/shared_type/msg";

export async function createChat(user1Id: number, user2Id: number) {
    const chatId = await insertChat(user1Id, user2Id);
    if (chatId)
        return chatId;
    else
        throw new InternalError();
}

export async function createMessage(chatId: number, userId: number, content: string) {
    await insertMessage(chatId, userId, content, EChatStatus.UNREAD);
}