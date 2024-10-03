import { RowDataPacket } from "mysql2";
import {IUserInput, IUserOutput, IUserPictureInput} from './shared_type/user';

export interface IUserDb extends RowDataPacket, IUserInput, IUserOutput {
  createdAt: Date
}

export interface IEmailConfirmToken extends RowDataPacket {
  id: number,
  user: number,
  confirmToken: string,
  createdAt: Date
}

export interface IResetPasswordToken extends RowDataPacket {
  id: number,
  user: number,
  resetToken: string,
  createdAt: Date
}

export interface IUserInterest extends RowDataPacket {
  id: number,
  interest: string,
  createdAt: Date
}
export interface IUserPicture extends RowDataPacket, IUserPictureInput {
  id: number,
  createdAt: Date
}

export interface IUserVisit extends RowDataPacket {
  id: number,
  visiter: number,
  visited: number,
  createdAt: Date
}