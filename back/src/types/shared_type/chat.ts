import type { IUserOutput } from "./user"
import type { MsgOutput_t } from "./msg"

export class Chat_c {

    constructor(id: number, interlocutors: [IUserOutput, IUserOutput], msg: MsgOutput_t[]) {
        this.id = id;
        this.interlocutors = interlocutors;
        this.msg = msg;
    }
    
    id: number
    interlocutors: [IUserOutput, IUserOutput]
    msg: MsgOutput_t[]
}