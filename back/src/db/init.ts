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
        userId INT NOT NULL,
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
        userId INT NOT NULL,
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
        userId INT NOT NULL,
        interest VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(userInterestsTableQuery);

    // Create userPictures table

    const userPicturesTableQuery = `
        CREATE TABLE IF NOT EXISTS userPictures (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
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
        visitedUserId INT NOT NULL,
        visiterUserId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(userVisitsTableQuery);

    // Create userLikes table

    const userLikesTableQuery = `
        CREATE TABLE IF NOT EXISTS userLikes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        likedUserId INT NOT NULL,
        likerUserId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(userLikesTableQuery);

    // Create userBlocks table

    const userBocksTableQuery = `
        CREATE TABLE IF NOT EXISTS userBlocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        blockerUserId INT NOT NULL,
        blockedUserId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(userBocksTableQuery);

    // Create userBlocks table

    const userReportsTableQuery = `
        CREATE TABLE IF NOT EXISTS userReports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reportedUserId INT NOT NULL,
        reporterUserId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(userReportsTableQuery);

    // Create notifications table

    const notificationsTableQuery = `
        CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        involvedUserId INT NOT NULL,
        type ENUM('LIKE', 'VISIT', 'MSG', 'MATCH') NOT NULL,
        isRead BOOLEAN NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(notificationsTableQuery);

    // Create userChats table

    const userChatsTableQuery = `
        CREATE TABLE IF NOT EXISTS userChats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user1Id INT NOT NULL,
        user2Id INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(userChatsTableQuery);

    // Create chatMessages table

    const chatMessagesTableQuery = `
        CREATE TABLE IF NOT EXISTS chatMessages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chatId INT NOT NULL,
        userId INT NOT NULL,
        status ENUM('read', 'unread') NOT NULL,
        content TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await connection.query(chatMessagesTableQuery);

    // Create uniformized chats view

    const uniformizedChatViewQuery = `
        CREATE OR REPLACE VIEW uniformizedChats AS (
            SELECT
                uc.user1Id AS userId,
                uc.user2Id AS otherUserId,
                uc.id
            FROM
                userChats uc
            UNION
            SELECT
                uc.user2Id AS userId,
                uc.user1Id AS otherUserId,
                uc.id
            FROM
                userChats uc
        );
    `;

    await connection.query(uniformizedChatViewQuery);

    // Create full users view

    const fullUserViewQuery = `
        CREATE OR REPLACE VIEW fullUsers AS (
            WITH
                user_interests AS (
                    SELECT
                        ui.userId,
                        JSON_ARRAYAGG(ui.interest) AS interests
                    FROM
                        userInterests ui
                    GROUP BY
                        ui.userId
                ),
                user_pictures AS (
                    SELECT
                        up.userId,
                        JSON_ARRAYAGG(JSON_OBJECT("filename", up.filename, "pictureIndex", up.pictureIndex)) AS pictures
                    FROM
                        userPictures up
                    GROUP BY
                        up.userId
                ),
                user_visits AS (
                    SELECT
                        uv.visitedUserId,
                        JSON_ARRAYAGG(JSON_OBJECT("date", uv.createdAt, "visiterUserId", uv.visiterUserId)) AS visits
                    FROM
                        userVisits uv
                    GROUP BY
                        uv.visitedUserId
                ),
                user_liked AS (
                    SELECT
                        ul.likedUserId,
                        JSON_ARRAYAGG(JSON_OBJECT("date", ul.createdAt, "likerUserId", ul.likerUserId)) AS likedBy
                    FROM
                        userLikes ul
                    GROUP BY
                        ul.likedUserId
                ),
                user_liker AS (
                    SELECT
                        likerUserId,
                        JSON_ARRAYAGG(JSON_OBJECT("date", ul.createdAt, "likedUserId", ul.likedUserId)) AS liking
                    FROM
                        userLikes ul
                    GROUP BY
                        ul.likerUserId
                ),
                user_notifications AS (
                    SELECT
                        n.userId,
                        JSON_ARRAYAGG(JSON_OBJECT("date", n.createdAt, "involvedUserId", n.involvedUserId, "type", n.type, "isRead", n.isRead)) AS notifications
                    FROM
                        notifications n
                    GROUP BY
                        n.userId
                ),
                user_blocked AS (
                    SELECT
                        blockedUserId,
                        JSON_ARRAYAGG(JSON_OBJECT("date", ub.createdAt, "blockerUserId", ub.blockerUserId)) AS blockedBy
                    FROM
                        userBlocks ub
                    GROUP BY
                        ub.blockedUserId
                ),
                user_blocker AS (
                    SELECT
                        blockerUserId,
                        JSON_ARRAYAGG(JSON_OBJECT("date", ub.createdAt, "blockedUserId", ub.blockedUserId)) AS blocking
                    FROM
                        userBlocks ub
                    GROUP BY
                        ub.blockerUserId
                ),
                chat_messages AS (
                    SELECT
                        cm.chatId,
                        JSON_ARRAYAGG(JSON_OBJECT("id", cm.id, "userId", cm.userId, "status", cm.status, "content", cm.content, "date", cm.createdAt)) AS messages
                    FROM
                        chatMessages cm
                    GROUP BY
                        cm.chatId
                ),
                user_chats AS (
                    SELECT
                        uc.userId,
                        JSON_ARRAYAGG(JSON_OBJECT("id", uc.id, "interlocutor", uc.otherUserId, "msg", cm.messages)) AS chats
                    FROM
                        (
                            SELECT
                                uc.user1Id AS userId,
                                uc.user2Id AS otherUserId,
                                uc.id
                            FROM
                                userChats uc
                            UNION
                            SELECT
                                uc.user2Id AS userId,
                                uc.user1Id AS otherUserId,
                                uc.id
                            FROM
                                userChats uc
                        ) AS uc
                        LEFT JOIN chat_messages cm ON cm.chatId = uc.id
                    GROUP BY
                        uc.userId
                )

            SELECT
                u.*,
                ui.interests AS interests,
                up.pictures AS pictures,
                uv.visits AS visits,
                uld.likedBy AS likedBy,
                ulr.liking AS liking,
                n.notifications AS notifications,
                ubd.blockedBy AS blockedBy,
                ubr.blocking AS blocking,
                uc.chats AS chats

            FROM users u
                LEFT JOIN user_interests ui ON ui.userId = u.id
                LEFT JOIN user_pictures up ON up.userId = u.id
                LEFT JOIN user_visits uv ON uv.visitedUserId = u.id
                LEFT JOIN user_liked uld ON uld.likedUserId = u.id
                LEFT JOIN user_liker ulr ON ulr.likerUserId = u.id
                LEFT JOIN user_notifications n ON n.userId = u.id
                LEFT JOIN user_blocked ubd ON ubd.blockedUserId = u.id
                LEFT JOIN user_blocker ubr ON ubr.blockerUserId = u.id
                LEFT JOIN user_chats uc ON uc.userId = u.id
        );
    `;

    await connection.query(fullUserViewQuery);

    connection.release();
}