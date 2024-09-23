import { deleteUser, insertUser, retrieveUserFromId, updateUser } from "../db/users";
import bcrypt from 'bcrypt';
import { IUser, string2Gender, string2SexualPref } from "../types/user";

async function convertValues(rawUser: any): Promise<[string, number, number]> {
    const hashedPassword: string = await bcrypt.hash(rawUser.password, 10);
    let latitude: number;
    let longitude: number;

    if ('latitude' in rawUser) {
        latitude = parseFloat(rawUser.latitude);
        longitude = parseFloat(rawUser.longitude);
    } else {
        latitude = 0; // TODO: compute from IP ?
        longitude = 0;
    }

    return [hashedPassword, latitude, longitude];
}

export async function createUser(rawUser: any) {

    const [hashedPassword, latitude, longitude] = await convertValues(rawUser);

    const user: IUser = {
        email: rawUser.email,
        firstName: rawUser.firstName,
        lastName: rawUser.lastName,
        password: hashedPassword,
        gender: string2Gender(rawUser.gender),
        sexualPref: string2SexualPref(rawUser.sexualPref),
        biography: rawUser.biography,
        fameRate: 0,
        latitude: latitude,
        longitude: longitude,
        lastConnection: new Date()
    };

    insertUser(user);
}

export async function getUser(id: number): Promise<IUser> {
    const user: IUser = await retrieveUserFromId(id);
    delete user.email;
    delete user.created_at;
    delete user.password;
    return user;
}

export async function removeUser(id: number) {
    await deleteUser(id);
}

export async function patchUser(id: number, rawUser: any) {

    await updateUser(id, rawUser);
}