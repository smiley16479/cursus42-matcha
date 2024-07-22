import winston, { config, transport } from 'winston';

const levels: config.AbstractConfigSetLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors: config.AbstractConfigSetColors = {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
    ),
);

// affichage uniquement en console pour l'instant
const transports: transport[] = [new winston.transports.Console()];

export const logger = winston.createLogger({
    levels,
    level: 'debug',
    format,
    transports,
});
