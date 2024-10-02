import type { ITotalUser, IUserPictureInput } from "./user"
import type { Msg_t } from "./msg"

export enum ChatStatus {
  READ = 'read',
  UNREAD = 'unread',
}

export class Chat_c {

  constructor({
    id = undefined,
    status = ChatStatus.UNREAD,
    interlocutor = undefined,
    msg = [],
  } = {}) {
      // console.log(`constructor Chat_c ${debug}`);
      this.id = id;
      this.status = status;
      this.interlocutor = interlocutor;
      this.msg = msg;
    }

  id?: number
  status: ChatStatus
  interlocutor?: Partial<ITotalUser>
  msg: Msg_t[]
}