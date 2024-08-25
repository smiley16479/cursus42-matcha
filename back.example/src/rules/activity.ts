import { checkSchema } from 'express-validator';
import { genBodySchema } from './locales';

export const create = checkSchema({
    label: genBodySchema({
        label: 'Le label',
        isString: true,
        notEmpty: true,
        optional: false,
        maxLength: 50,
        trim: true
    }),
    description: genBodySchema({
        label: 'La description',
        isString: true,
        notEmpty: true,
        optional: false,
        maxLength: 1500,
        trim: true
    }),
    date: genBodySchema({
        label: 'La date',
        isDate: true,
        notEmpty: true,
        optional: false,
    }),
    iconPath: genBodySchema({
        label: 'La chemin de l\'icone',
        isString: true,
        notEmpty: false,
        optional: true,
        maxLength: 65535,
    }),
    result: genBodySchema({
        label: 'La chemin de l\'icone',
        isBoolean: true,
        notEmpty: false,
        optional: true,
    })
});