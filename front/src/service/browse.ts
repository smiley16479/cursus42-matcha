import {axios} from '@/service/interceptor/axios'
import type { IUserSelf } from '@/type/shared_type/user';


/** Get all match from an userId */
export async function browse(searchPref: any): Promise<IUserSelf[]| null>{
	try {
		return (await axios.post(`browse`, searchPref, {withCredentials: true})).data as IUserSelf[];
	} catch (error) {
		console.log('error', error);
		return null;
	}
}

// /** Créer un match  */
// export async function newMatch(param : any): Promise<Match_c | null> {
// 	console.log('creating new Match', param);
// 	try {
// 		return (await axios.post('match/create', param, {withCredentials: true})).data;
// 	} catch (error) {
// 		console.log('error', error);
// 		return null;
// 	}
// }

// /** Get all matchs from an entity */
// export async function getMatch(entityId : number): Promise<Match_c[]| null>{
// 	try {
// 		return await axios.get(`match/entity/${entityId}`) as Match_c[];
// 	} catch (error) {
// 		console.log('error', error);
// 		return null;
// 	}
// }

// /** delete un match  */
// export async function deleteMatch(matchId : number) {
// 	console.log('deleting match', matchId);
// 	try {
// 		return (await axios.delete(`match/del/${matchId}`, {withCredentials: true})).data;
// 	} catch (error) {
// 		console.log('error', error);
// 	}
// }
