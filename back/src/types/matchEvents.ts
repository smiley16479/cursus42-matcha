import { RowDataPacket } from "mysql2";

export interface IUserMatchEventDb extends RowDataPacket {
    id: number,
    user1Id: number,
    user2Id: number,
    title: string,
    eventDate: Date,
    eventLocation: string,
    description: string,
    createdAt: Date
}