import { body } from "express-validator";
import { ESortingType, ESortOn } from "../types/shared_type/research";
import { EInterest, ESexualPref } from "../types/shared_type/user";

export const researchValidator = [
    body("sexualPref").isString().trim().isIn(Object.values(ESexualPref))
        .withMessage(`Sexual preference must be one of [${Object.values(ESexualPref).join(', ')}]`),

    body("matchAgeMin").isInt({ gt: -1 })
        .withMessage('Min age must be positive integer'),

    body("matchAgeMax").isInt({ gt: -1 })
        .withMessage('Max age must be positive integer'),

    body("minFameRate").isInt({ gt: -1 })
        .withMessage('Min famerate must be positive integer'),

    body("maxFameRate").isInt({ gt: -1 })
        .withMessage('Max famerate must be positive integer'),

    body("latitude").toFloat().isFloat({ min: -90, max: 90 })
        .withMessage('Location latitude must be between -90 and 90'),

    body("longitude").toFloat().isFloat({ min: -180, max: 180 })
        .withMessage('Location longitude must be between -180 and 180'),

    body("maxDistance").isInt({ gt: -1 })
        .withMessage('Max distance must be positive integer'),

    body("interests").isArray()
        .withMessage('Interests must be an array of strings'),
    body("interests.*").isString().trim().isIn(Object.values(EInterest))
        .withMessage(`Interests must be an array of a selection of [${Object.values(EInterest).join(', ')}]`),

    body("offset").isInt({ gt: -1 })
        .withMessage('Offset must be positive integer'),

    body("nbRequiredProfiles").isInt({ gt: -1 })
        .withMessage('number of required profiles must be positive integer'),

    body("sortingOn").isString().trim().isIn(Object.values(ESortOn))
        .withMessage(`Sorting on must be one of [${Object.values(ESortOn).join(', ')}]`),

    body("sortingType").isString().trim().isIn(Object.values(ESortingType))
        .withMessage(`Sorting type must be one of [${Object.values(ESortingType).join(', ')}]`),
]