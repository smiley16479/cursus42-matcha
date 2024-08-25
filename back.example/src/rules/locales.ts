import { CustomValidator, ParamSchema } from 'express-validator';
import { locales } from '../locales';

interface Schema {
    label: string,
    notEmpty?: boolean,
    isString?: boolean,
    maxLength?: number,
    isInt?: boolean,
    isFloat?: boolean,
    isBoolean?: boolean,
    isDate?: boolean,
    isTime?: boolean,
    isEmail?:boolean,
    isArray?: boolean,
    isObject?: boolean,
    isURL?: boolean,
    trim?: boolean,
    optional?: boolean,
    custom?: CustomValidator,
}

export function genBodySchema(schema: Schema): ParamSchema {
    const res: ParamSchema = {
        in: 'body',
    };

    if (schema.isString) {
        res.isString = {
            errorMessage: locales.errors.badRequest.isString(schema.label),
        };
    }

    if (schema.isTime) {
        res.isTime = {
            options : {
                mode: 'withSeconds'
            },
            errorMessage: locales.errors.badRequest.isTime(schema.label),
        };
    }

    if (schema.isURL) {
        res.isURL = {
            options : {
                protocols: ['http', 'https'],
                require_protocol : true,
                allow_underscores : true
            },
            errorMessage: locales.errors.badRequest.isURL(schema.label),
        };
    }

    if (schema.notEmpty) {
        res.notEmpty = {
            errorMessage: locales.errors.badRequest.notEmpty(schema.label),
        };
    }

    if (schema.maxLength) {
        res.isLength = {
            options : {max : schema.maxLength},
            errorMessage: locales.errors.badRequest.maxLength(schema.label, schema.maxLength),
        };
    }

    if (schema.isInt) {
        res.isInt = {
            errorMessage: locales.errors.badRequest.isInt(schema.label),
        };
    }

    if (schema.isBoolean) {
        res.isBoolean = {
            errorMessage: locales.errors.badRequest.isBoolean(schema.label),
        };
    }

    if (schema.isFloat) {
        res.isFloat = {
            errorMessage: locales.errors.badRequest.isFloat(schema.label),
        };
    }

    if (schema.isDate){
        res.isDate = {
            errorMessage: locales.errors.badRequest.isDate(schema.label),
        }; 
    }

    if (schema.trim) {
        res.trim = true;
    }

    if (schema.isEmail){
        res.isEmail = {
            errorMessage: locales.errors.badRequest.isEmail(schema.label),
        };
    }

    if(schema.optional){
        res.optional = {
            options: { nullable: true }
        };
    }

    if (schema.custom) {
        res.custom = {
            options: schema.custom,
        };
    }

    if (schema.isArray) {
        res.isArray = true;
    }

    if (schema.isObject) {
        res.isObject = true;
    }

    return res;
}
