import { checkSchema } from 'express-validator';
import { genBodySchema } from './locales';

export const login = checkSchema({
    username: genBodySchema({
        label: 'L\'identifiant',
        isString: true,
        notEmpty: true,
    }),
    password: genBodySchema({
        label: 'Le mot de passe',
        isString: true,
        notEmpty: true,
    }),
});
