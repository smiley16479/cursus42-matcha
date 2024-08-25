import connection from './connect';
import { Gender, SexualPref, User } from '../types/user';


export default function insertUser(user: User) {

    const sqlQuery = `INSERT INTO users (
    email,
    firstName,
    lastName,
    password,
    gender,
    sexualPref,
    biography,
    fameRate,
    latitude,
    longitude,
    lastConnection)
    VALUES (
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?
    )`;

    const userAttrs = [
        user.email,
        user.firstName,
        user.lastName,
        user.password,
        user.gender,
        user.sexualPref,
        user.biography,
        user.fameRate,
        user.longitude,
        user.latitude,
        new Date(user.lastConnection)
    ];

    connection.query(sqlQuery, userAttrs, (err: any, results: any, fields: any) => {
        if (err) {
            console.log('An error occurred while inserting user in database');
            throw err;
        }
    });
}