import { deleteEmailConfirmationToken, deleteUser, insertEmailConfirmToken, insertUser, retrieveEmailConfirmationTokenFromToken, retrieveUserFromId, updateUser } from "../db/users";
import bcrypt from 'bcrypt';
import { IEmailConfirmToken, IUserDb, IUserInput, IUserOutput, string2Gender, string2SexualPref } from "../types/user";
import nodemailer from 'nodemailer';
import * as crypto from "node:crypto";
import moment from 'moment';

export async function createUser(rawUser: any) {

    const [hashedPassword, latitude, longitude] = await convertValues(rawUser);

    const user: IUserInput = {
        email: rawUser.email,
        emailVerified: false,
        firstName: rawUser.firstName,
        lastName: rawUser.lastName,
        password: hashedPassword,
        gender: string2Gender(rawUser.gender),
        sexualPref: string2SexualPref(rawUser.sexualPref),
        biography: rawUser.biography,
        fameRate: 0,
        latitude: latitude,
        longitude: longitude,
        lastConnection: new Date(),
    };

    const id = await insertUser(user);
    sendVerificationEmail(id);
}

export async function getUser(id: number): Promise<IUserOutput> {
    const user: IUserOutput = await retrieveUserFromId(id);
    return user;
}

export async function removeUser(id: number) {
    await deleteUser(id);
}

export async function patchUser(id: number, rawUser: any) {
    await updateUser(id, rawUser);
}

export async function verifyEmail(token: string) {
    const emailConfirmToken: IEmailConfirmToken = await retrieveEmailConfirmationTokenFromToken(token);
    if (emailConfirmToken.confirmToken) {
        let hours = moment().diff(moment(emailConfirmToken.createdAt), 'hours');
        if (hours <= 24) {
            updateUser(emailConfirmToken.user, {emailVerified: true});
            deleteEmailConfirmationToken(emailConfirmToken.id);
        }
    }
}

// Helpers

async function convertValues(rawUser: any): Promise<[string, number, number]> {
    const hashedPassword: string = await bcrypt.hash(rawUser.password, 10);
    let latitude: number;
    let longitude: number;

    if ('latitude' in rawUser) {
        latitude = parseFloat(rawUser.latitude);
        longitude = parseFloat(rawUser.longitude);
    } else {  // TODO: compute from IP ?
        latitude = 0;
        longitude = 0;
    }

    return [hashedPassword, latitude, longitude];
}


async function sendVerificationEmail(id: number) {

    const user: IUserDb = await retrieveUserFromId(id);
    const confirmToken: string = crypto.randomBytes(20).toString('hex');
    await insertEmailConfirmToken(id, confirmToken);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        secure: true,
        auth: {
            user: process.env.MAILER_LOGIN,
            pass: process.env.MAILER_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"Matcha!" <matcha@42l.fr>',
        to: user.email,
        subject: "Confirm your email!",
        text: "Confirm your email by using this link : http://localhost:3000/api/user/emailverif/" + confirmToken,
        html: "<b>To confirm your email, click this <u><a href='http://localhost:3000/api/user/confirmemail/" + confirmToken + "'>link<a></u></b>",
    });

    console.log("Message sent: %s", info.messageId);
}