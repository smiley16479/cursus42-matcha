import pool from './dbUtils';

export default async function initDb() {

    const connection = await pool.getConnection();

    // Create user table
    const userTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        emailVerified BOOLEAN NOT NULL,
        userName VARCHAR(255) NOT NULL UNIQUE,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        gender ENUM('Female', 'Male', 'Unknown') NOT NULL,
        sexualPref ENUM('Female', 'Male', 'Both') NOT NULL,
        age INT NOT NULL,
        biography TEXT NOT NULL,
        fameRate INT NOT NULL,
        latitude DECIMAL(15, 10),
        longitude DECIMAL(15, 10),
        lastConnection TIMESTAMP NOT NULL,
        profileVisibility BOOLEAN NOT NULL,
        emailNotifications BOOLEAN NOT NULL,
        maxDistance INT NOT NULL,
        matchAgeMin INT NOT NULL,
        matchAgeMax INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(userTableQuery);

    // Create emailConfirmToken table
    const emailConfirmTokenTableQuery = `
        CREATE TABLE IF NOT EXISTS emailConfirmTokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user INT NOT NULL,
        confirmToken VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(emailConfirmTokenTableQuery);

    // TODO : remove old confirmTokens

    // Create resetPasswordToken table
    const resetPasswordTokenTableQuery = `
        CREATE TABLE IF NOT EXISTS resetPasswordTokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user INT NOT NULL,
        resetToken VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(resetPasswordTokenTableQuery);

    // TODO : remove old resetPasswordTokens


    // Create userInterests table

    const userInterestsTableQuery = `
        CREATE TABLE IF NOT EXISTS userInterests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user INT NOT NULL,
        interest VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(userInterestsTableQuery);

    // Create userPictures table

    const userPicturesTableQuery = `
        CREATE TABLE IF NOT EXISTS userPictures (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user INT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        pictureIndex INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(userPicturesTableQuery);

    // Create userVisits table

    const userVisitsTableQuery = `
        CREATE TABLE IF NOT EXISTS userVisits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        visited INT NOT NULL,
        visiter INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(userVisitsTableQuery);

    // Create userLikes table

    const userLikesTableQuery = `
        CREATE TABLE IF NOT EXISTS userLikes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        liked INT NOT NULL,
        liker INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(userLikesTableQuery);

    // Create userBlocks table

    const userBocksTableQuery = `
        CREATE TABLE IF NOT EXISTS userBlocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        blocked INT NOT NULL,
        blocker INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(userBocksTableQuery);

    // Create notifications table

    const notificationsTableQuery = `
        CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user INT NOT NULL,
        involvedUser INT NOT NULL,
        type ENUM('LIKE', 'VISIT', 'MSG', 'MATCH') NOT NULL,
        isRead BOOLEAN NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(notificationsTableQuery);

    // Create full users view

    const fullUserViewQuery = `
        CREATE OR REPLACE VIEW fullUsers AS (
            WITH
                user_interests AS (
                    SELECT
                        ui.user,
                        JSON_ARRAYAGG(ui.interest) AS interests
                    FROM
                        userInterests ui
                    GROUP BY
                        ui.user
                ),
                user_pictures AS (
                    SELECT
                        up.user,
                        JSON_ARRAYAGG(JSON_OBJECT("filename", up.filename, "pictureIndex", up.pictureIndex)) AS pictures
                    FROM
                        userPictures up
                    GROUP BY
                        up.user
                ),
                user_visits AS (
                    SELECT
                        uv.visited,
                        JSON_ARRAYAGG(JSON_OBJECT("date", uv.createdAt, "visiterId", uv.visiter)) AS visits
                    FROM
                        userVisits uv
                    GROUP BY
                        uv.visited
                ),
                user_likes AS (
                    SELECT
                        ul.liked,
                        JSON_ARRAYAGG(JSON_OBJECT("date", ul.createdAt, "likerId", ul.liker)) AS likes
                    FROM
                        userLikes ul
                    GROUP BY
                        ul.liked
                ),
                user_notifications AS (
                    SELECT
                        n.user,
                        JSON_ARRAYAGG(JSON_OBJECT("date", n.createdAt, "involvedUser", n.involvedUser, "type", n.type, "isRead", n.isRead)) AS notifications
                    FROM
                        notifications n
                    GROUP BY
                        n.user
                )

            SELECT
                u.*,
                ui.interests AS interests,
                up.pictures AS pictures,
                uv.visits AS visits,
                ul.likes AS likes,
                n.notifications AS notifications

            FROM users u
                LEFT JOIN user_interests ui ON ui.user = u.id
                LEFT JOIN user_pictures up ON up.user = u.id
                LEFT JOIN user_visits uv ON uv.visited = u.id
                LEFT JOIN user_likes ul ON ul.liked = u.id
                LEFT JOIN user_notifications n ON n.user = u.id
        );
    `;

    await connection.query(fullUserViewQuery);

    connection.release();
}