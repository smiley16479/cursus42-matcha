import mysql from 'mysql2/promise';
import dotenvFlow from 'dotenv-flow';
import { logger } from './logger.config';

export const db = (async () => {
    // process.env.NODE_ENV = 'development';
    const envConfig = dotenvFlow.config().parsed;

    if (envConfig) {
        Object.keys(envConfig).forEach((key) => {
          process.env[key] = envConfig[key];
        });
    }

    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      };

    // Connexion à la base de données MySQL
    try {
      const connection = await mysql.createConnection(dbConfig);
      console.log('Connecté à la base de données MySQL');
      return connection;
    } catch (error) {
      console.error('Erreur de connexion à la base de données :', error);
      throw error;
    }
})();


/** Execute une Query */
export async function executeQuery(query: string, connection: mysql.Connection) {
    try {
      const [results, ] = await connection.execute(query);
      return results;
    } catch (error) {
      console.error('Erreur lors de l\'exécution de la requête :', error);
      throw error;
    } finally {
      connection.end();
    }
  }
