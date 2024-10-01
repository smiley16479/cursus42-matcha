import type { User_tm } from "./user"
import type { Msg_t } from "./msg"

export enum ChatStatus {
  READ = 'read',
  UNREAD = 'unread',
}

export class Chat_c {

  constructor({
    name = '',
    status = ChatStatus.UNREAD,
    createdAt = undefined,
    createdBy = undefined,
    user = [],
    msg = [],
    debug = ""
  } = {}) {
      console.log(`constructor Chat_c ${debug}`);
      this.name = name;
      this.status = status;
      this.createdAt = createdAt;
      this.createdBy = createdBy;
      this.user = user;
      this.msg = msg;
    }

  id?: number
  name: string
  status?: ChatStatus
  createdAt?: string
  createdBy?: User_tm
  user: User_tm[]
  msg: Msg_t[]
}