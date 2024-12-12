import { RowDataPacket } from "mysql2";
import { EChatStatus } from "./shared_type/msg";

export interface IChatDb extends RowDataPacket {
    id: number,
    user1Id: number,
    user2Id: number,
    createdAt: Date,
    msg: []
}

export interface IMesssageDb extends RowDataPacket {
    id: number,
    chatId: number,
    userId: number,
    status: EChatStatus,
    content: string,
    createdAt: Date
}