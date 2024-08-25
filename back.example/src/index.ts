import dotenv from 'dotenv';
dotenv.config(); // load env variables

import express, { json, urlencoded, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { errorMiddleware, loggerMiddleware } from './middlewares';
import { router } from './routes';
import { NotFoundError } from './errors';
import { logger } from './configs/logger.config';
import { db, executeQuery } from './configs/db.config';
import { Connection } from 'mysql2/promise';

const app: express.Application = express();

app.use(loggerMiddleware);
        
app.use(cors()); // TODO: definir les options
app.use(json());
app.use(urlencoded({ extended: true }));

// setup router
app.use('/api', router);

// handle 404
app.use(
    (_req: Request, _res: Response, next: NextFunction) => next(new NotFoundError())
);

// handle errors
app.use(errorMiddleware);

const port = parseInt(process.env.PORT || '3000');

let connexion: Connection;
db.then((e)=> connexion = e).then(() => app.listen(port, () => logger.info(`Listening on port ${port}`)));

/** TEST: Route pour créer une table */
app.get('/create-table', async (req, res) => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    try {
      await executeQuery(createTableQuery, connexion);
      res.send('Table "users" créée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création de la table :', error);
      res.status(500).send('Erreur de serveur');
    }
  });
  