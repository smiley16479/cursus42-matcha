import Joi from 'joi';

const visit_schema = Joi.number().integer().greater(0);

export function validateVisitInput(input: any) {
    const { error, value } = visit_schema.validate(input);
    return [ error, value ];
}


const like_schema = Joi.number().integer().greater(0);

export function validateLikeInput(input: any) {
    const { error, value } = like_schema.validate(input);
    return [ error, value ]
}

const unlike_schema = Joi.number().integer().greater(0);

export function validateUnlikeInput(input: any) {
    const { error, value } = unlike_schema.validate(input);
    return [ error, value ]
}

const block_schema = Joi.number().integer().greater(0);

export function validateBlockInput(input: any) {
    const { error, value } = block_schema.validate(input);
    return [ error, value ]
}

const unblock_schema = Joi.number().integer().greater(0);

export function validateUnblockInput(input: any) {
    const { error, value } = unblock_schema.validate(input);
    return [ error, value ]
}

const report_schema = Joi.number().integer().greater(0);

export function validateReportInput(input: any) {
    const { error, value } = report_schema.validate(input);
    return [ error, value ]
}

const read_notif_schema = Joi.number().integer().greater(0);

export function validateReadNotifInput(input: any) {
    const { error, value } = read_notif_schema.validate(input);
    return [ error, value ]
}

const match_event_schema = Joi.object({
    guestId: Joi.number().integer().greater(0).required(),
    title: Joi.string().normalize().required(),
    date: Joi.date().required(),
    location: Joi.string().normalize().required(),
    description: Joi.string().normalize().required()
});

export function validateMatchEventInput(input: any) {
    const { error, value } = match_event_schema.validate(input);
    return [ error, value ]
}

const remove_match_event_schema = Joi.number().integer().greater(0);

export function validateRemoveMatchEventInput(input: any) {
    const { error, value } = remove_match_event_schema.validate(input);
    return [ error, value ]
}

const msg_schema = Joi.object({
	chatId: Joi.number().integer().greater(0).required(),
	userId: Joi.number().integer().greater(0).required(),
	destId: Joi.number().integer().greater(0),
	content: Joi.string().normalize().required(),
});

export function validateMsgInput(input: any) {
    const { error, value } = msg_schema.validate(input);
    return [ error, value ]
}