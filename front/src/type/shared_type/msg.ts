export type Msg_t = {
	id?: number,
	chatId: number,
	userId: number,
	content: string,
	createdAt: string
}

/*********************************************************
 * ================== MSG UTILS ====================
 *********************************************************/

export function initMsg(): Msg_t {
	return {
		id: -1,
		chatId: -1,
		userId: -1,
		content: "",
		createdAt: "",
	}
}