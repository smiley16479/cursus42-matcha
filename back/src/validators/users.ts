import { body, param } from "express-validator";
import { EGender, ESexualPref } from "../types/shared_type/user";

export const createUserValidator = [
    body("email").isString().trim().isEmail().normalizeEmail({gmail_remove_dots: true, all_lowercase: true})
    .withMessage('Email wasn\'t recognized as an email'),

    body("firstName").isString().notEmpty().trim().escape()
    .withMessage('FirstName must be a string'),
    
    body("lastName").isString().notEmpty().trim().escape()
    .withMessage('LastName must be a string'),

    body("userName").isString().notEmpty().trim().escape()
    .withMessage('UserName must be a string'),

    body("password").isString()
    .withMessage('Password must be a string'),
    
    body("gender").optional().isString().trim().isIn(Object.values(EGender))
    .withMessage(`Gender must be one of [${Object.values(EGender).join(', ')}]`),
    
    body("sexualPref").optional().isString().trim().isIn(Object.values(ESexualPref))
    .withMessage(`SexualPref must be one of [${Object.values(ESexualPref).join(', ')}]`),
    
    body("biography").optional().isString().trim().escape()
    .withMessage('Biography must be a string'),
    
    body("latitude").optional().toFloat().isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
    
    body("longitude").optional().toFloat().isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
]

export const loginValidator = [
    body("userName").isString().trim()
    .withMessage('UserName must be a string'),

    body("password").isString()
    .withMessage('Password must be a string')
]

export const getUserValidator = [
    param("id").isInt({gt: 0})
    .withMessage('Id must be an integer greater than 0')
]

export const patchUserValidator = [
    body("firstName").optional().isString().trim().escape()
    .withMessage('FirstName must be a string'),
    
    body("lastName").optional().isString().trim().escape()
    .withMessage('LastName must be a string'),

    body("email").optional().isString().trim().isEmail().normalizeEmail({gmail_remove_dots: true, all_lowercase: true})
    .withMessage('Email wasn\'t recognized as an email'),

    body("gender").optional().isString().trim().isIn(Object.values(EGender))
    .withMessage(`Gender must be one of [${Object.values(EGender).join(', ')}]`),
    
    body("sexualPref").optional().isString().trim().isIn(Object.values(ESexualPref))
    .withMessage(`SexualPref must be one of [${Object.values(ESexualPref).join(', ')}]`),
    
    body("biography").optional().isString().trim().escape()
    .withMessage('Biography must be a string'),
    
    body("latitude").optional().toFloat().isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
    
    body("longitude").optional().toFloat().isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

    body("interests").optional().isArray()
    .withMessage('Interests must be an array of strings'),
    body("interests.*").optional().isString()
    .withMessage('Interests must be an array of strings'),

    body("age").optional().isInt({gt: 17})
    .withMessage('Age must be a number greater than 17'),

    body("bio").optional().isString().trim().escape()
    .withMessage('Biography must be a string'),
    
    body("profileVisibility").optional().isBoolean()
    .withMessage('Profile visibility must be a boolean'),

    body("emailNotifications").optional().isBoolean()
    .withMessage('Email notifications must be a boolean'),

    body("maxDistance").optional().isInt({gt: -1})
    .withMessage('Max distance must be an int greater than -1'),

    body("matchAgeMin").optional().isInt({gt: 17})
    .withMessage('Match age min must be greater than 17'),
    
    body("matchAgeMax").optional().isInt({gt: 17})
    .withMessage('Match age max must be greater than 17')
]

export const askResetPasswordValidator = [
    param("email").isString().trim().isEmail().normalizeEmail({gmail_remove_dots: true, all_lowercase: true})
    .withMessage('Email wasn\'t recognized as an email')
]

export const deletePictureValidator = [
    param("pictureIndex").isInt({min: 1, max: 5})
    .withMessage('Picture index must be an integer: 0 < index < 6')
]