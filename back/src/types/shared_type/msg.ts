export enum EChatStatus {
    READ = 'read',
    UNREAD = 'unread',
}

export type MsgOutput_t = {
	id: number,
	userId: number,
	chatId: number,
	content: string,
	status: EChatStatus,
	date: string
}

export type MsgInput_t = {
	chatId: number,
	userId: number,
	destId?: number,
	content: string,
}