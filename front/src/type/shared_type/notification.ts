import type { MsgOutput_t } from "./msg"
import type { IUserSelf } from "./user"


export enum Notif_t_E {
  MSG =  "MSG",
  MATCH = "MATCH",
  VUE = "VUE",
  VISITE = "VISITE",
  UNKNOWN = "UNKNOWN",
}

export type Notif_T = {
  type: Notif_t_E.UNKNOWN,
  msg: MsgOutput_t,
  /** Pour les match, vue et visite le profil de l'intéressé */
  user: IUserSelf
}