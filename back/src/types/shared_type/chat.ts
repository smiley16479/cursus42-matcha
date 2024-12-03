import type { IUserOutput } from "./user"
import type { Msg_t } from "./msg"

export class Chat_c {

    constructor(id: number, interlocutor: IUserOutput, msg: Msg_t[]) {
        this.id = id;
        this.interlocutor = interlocutor;
        this.msg = msg;
    }

    id: number
    interlocutor: IUserOutput
    msg: Msg_t[]
}