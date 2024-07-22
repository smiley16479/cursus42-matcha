import { checkSchema, ParamSchema } from 'express-validator';
import { genBodySchema } from './locales';

const schema = {
    username: genBodySchema({
        label: 'L\'identifiant',
        isString: true,
        trim: true,
        notEmpty: true,
        optional: false,
        maxLength: 20,
    }),
    password: genBodySchema({
        label: 'Le mot de passe',
        isString: true,
        notEmpty: true,
        maxLength: 255,
    }),
    lastname: genBodySchema({
        label: 'Le nom',
        isString: true,
        trim: true,
        notEmpty: true,
        maxLength: 50,
    }),
    firstname: genBodySchema({
        label: 'Le prénom',
        isString: true,
        trim: true,
        notEmpty: true,
        maxLength: 50,
    }),
    birthday: genBodySchema({
        label: 'La date de naissance',
        isDate: true,
        notEmpty: true,
    }),
    hiringDate: genBodySchema({
        label: 'La date d\'embauche',
        isDate: true,
        notEmpty: true,
        custom: (input: Date, { req }) => {
            if (req.body.missionEndDate && input > req.body.missionEndDate) {
                throw new Error('La date d\'embauche doit être antérieur à la date prévisionnelle de fin de mission.');
            }

            return input;
        },
    }),
    mail: genBodySchema({
        label: 'Le mail',
        isString: true,
        trim: true,
        notEmpty: true,
        maxLength: 150,
    }),
    phone: genBodySchema({
        label: 'Le numéro de téléphone',
        isString: true,
        trim: true,
        notEmpty: true,
        maxLength: 10,
    }),
    position: genBodySchema({
        label: 'La fonction',
        isString: true,
        trim: true,
        optional: true,
        maxLength: 50,
    }),
    rttRemaining: genBodySchema({
        label: 'La régulation des rtt',
        isFloat: true,
        notEmpty: true,
    }),
    paidLeaveRemaining: genBodySchema({
        label: 'Le nombre de jours restant',
        isFloat: true,
        notEmpty: false,
    }),
    isActive: genBodySchema({
        label: 'Le champ actif',
        isBoolean: true,
        notEmpty: true,
    }),
    dayDeduction: genBodySchema({
        label: 'Le nombre de jours déduits',
        isFloat: true,
        notEmpty: true,
    }),
    isUsingCra: genBodySchema({
        label: 'Le champ gestion CRA',
        isBoolean: true,
        notEmpty: true,
    }),
    missionEndDate: genBodySchema({
        label: 'La date de fin de mission',
        isDate: true,
        notEmpty: false,
        optional: true,
    }),
    isTrainee: genBodySchema({
        label: 'Le champ stagiaire',
        isBoolean: true,
        notEmpty: true,
    }),
    isStaffRepresentative: genBodySchema({
        label: 'Le champs délégué du personnel ',
        isBoolean: true,
        notEmpty: true,
    }),
    osamiamToken: genBodySchema({
        label: 'Le token Osamiam',
        isString: true,
        maxLength: 150,
        optional: true,
    }),
    missionLocation: genBodySchema({
        label: 'Le lieu de mission',
        isString: true,
        trim: true,
        maxLength: 30,
        optional: true,
    }),
    paceCode: genBodySchema({
        label: 'Le rythme',
        isString: true,
        optional: true,
    }),
    experience: genBodySchema({
        label: 'Le champ expérience',
        isFloat: true,
        optional: true,
    }),
    tjmMin: genBodySchema({
        label: 'Le TJM minimum',
        isInt: true,
        optional: true,
    }),
    technology: genBodySchema({
        label: 'Les technos',
        isString: true,
        trim: true,
        maxLength: 120,
        optional: true,
    }),
    roleId: genBodySchema({
        label: 'Le rôle',
        isInt: true,
    }),
};

export const create = checkSchema(schema);

const editSchema = schema as any;
Object.keys(editSchema).forEach(k => {
    editSchema[k] = { ...editSchema[k], optional: { options: { nullable: true }}};
});

export const edit = checkSchema(editSchema);

export const editPassword = checkSchema({
    newPassword: genBodySchema({
        label: 'Le nouveau mot de passe',
        isString: true,
        notEmpty: true,
        maxLength: 255,
    }),
    oldPassword: genBodySchema({
        label: 'L\'ancien mot de passe',
        isString: true,
        notEmpty: true,
        maxLength: 255,
    }),
});
