import type { IUserOutput } from "./user"
import type { MsgInput_t } from "./msg"

export enum ChatStatus {
  READ = 'read',
  UNREAD = 'unread',
}

export class Chat_c {

  constructor({
    id = undefined,
    interlocutor = undefined,
    msg = [],
  } = {}) {
      // console.log(`constructor Chat_c ${debug}`);
      this.id = id;
      this.interlocutor = interlocutor;
      this.msg = msg;
    }

  id?: number
  interlocutor?: Partial<IUserOutput>
  msg: MsgInput_t[]
}