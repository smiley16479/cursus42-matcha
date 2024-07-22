import morgan from 'morgan';
import { logger } from '../configs/logger.config';

const stream: morgan.StreamOptions = {
    write: msg => logger.http(msg),
};

export const loggerMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream },
);
