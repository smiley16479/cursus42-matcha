import {axios} from '@/service/interceptor/axios'
import type { Chat_c } from '@/type/chat';
import type { Msg_t } from '@/type/msg';

/** Créer un chat  */
export async function newChat(param : any): Promise<Chat_c | null> {
	console.log('creating new Chat', param);
	try {
		return (await axios.post('chat/create', param, {withCredentials: true})).data;
	} catch (error) {
		console.log('error', error);
		return null;
	}
}

/** Get all chats from an entity */
export async function getChat(entityId : number): Promise<Chat_c[]| null>{
	try {
		return await axios.get(`chat/entity/${entityId}`) as Chat_c[];
	} catch (error) {
		console.log('error', error);
		return null;
	}
}

/** Get all Support chats from an userId */
export async function getSupportChat(): Promise<Chat_c[]| null>{
	try {
		return (await axios.get(`chat/support`, {withCredentials: true})).data as Chat_c[];
	} catch (error) {
		console.log('error', error);
		return null;
	}
}

/** delete un chat  */
export async function deleteChat(chatId : number) {
	console.log('deleting Chat', chatId);
	try {
		return (await axios.delete(`chat/del/${chatId}`, {withCredentials: true})).data;
	} catch (error) {
		console.log('error', error);
	}
}

export async function newMsg(param : Msg_t) {
	console.log('creating new Msg', param);
	try {
		return await axios.post('msg/create', param);
	} catch (error) {
		console.log('error', error);
	}
}