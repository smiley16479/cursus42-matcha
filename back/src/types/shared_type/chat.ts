import type { IUserOutput } from "./user"
import type { MsgOutput_t } from "./msg"

export class Chat_c {

    constructor(id: number, interlocutor: IUserOutput, msg: MsgOutput_t[]) {
        this.id = id;
        this.interlocutor = interlocutor;
        this.msg = msg;
    }

    id: number
    interlocutor: IUserOutput
    msg: MsgOutput_t[]
}