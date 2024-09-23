import { deleteUser, insertUser, retrieveUserFromId, updateUser } from "../db/users";
import bcrypt from 'bcrypt';
import { IUserDb, IUserInput, IUserOutput, string2Gender, string2SexualPref } from "../types/user";
import nodemailer from 'nodemailer';

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
    console.log(id);
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

async function sendVerificationEmail(id: number) {

    const user: IUserDb = await retrieveUserFromId(id);

    const transporter = nodemailer.createTransport({
        host: "mail.42l.fr",
        port: 465,
        secure: true,
        auth: {
            user: "matcha@42l.fr",
            pass: 'NhDV8p)M8+k."]y',
        },
    });

    const info = await transporter.sendMail({
        from: '"Matcha!" <matcha@42l.fr>',
        to: user.email,
        subject: "Confirm your email!",
        text: "Hello world?",
        html: "<b>Hello world?</b>",
    });

    console.log("Message sent: %s", info.messageId);
}