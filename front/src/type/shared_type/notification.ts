import type { IUserOutput } from "./user"


export enum Notif_t_E {
  MSG = "MSG",
  MATCH = "MATCH",
  VISIT = "VISIT",
  LIKE = "LIKE",
  UNLIKE = "UNLIKE",
  EVENT = "EVENT",
}

export type Notif_T = {
  id: number,
  type: Notif_t_E,
  /**
  * The user who liked/visited/sent a msg etc
  */
  involvedUser: IUserOutput,
  date: Date,
  payload: any
}