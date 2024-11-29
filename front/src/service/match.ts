// import {axios} from '@/service/interceptor/axios'
// import type { Match_t } from '@/type/msg';


// /** Get all match from an userId */
// export async function getMatch(): Promise<Match_c[]| null>{
// 	try {
// 		return (await axios.get(`match/support`, {withCredentials: true})).data as Match_c[];
// 	} catch (error) {
// 		console.log('error', error);
// 		return null;
// 	}
// }

// // /** Créer un match  */
// // export async function newMatch(param : any): Promise<Match_c | null> {
// // 	console.log('creating new Match', param);
// // 	try {
// // 		return (await axios.post('match/create', param, {withCredentials: true})).data;
// // 	} catch (error) {
// // 		console.log('error', error);
// // 		return null;
// // 	}
// // }

// // /** Get all matchs from an entity */
// // export async function getMatch(entityId : number): Promise<Match_c[]| null>{
// // 	try {
// // 		return await axios.get(`match/entity/${entityId}`) as Match_c[];
// // 	} catch (error) {
// // 		console.log('error', error);
// // 		return null;
// // 	}
// // }

// /** delete un match  */
// export async function deleteMatch(matchId : number) {
// 	console.log('deleting match', matchId);
// 	try {
// 		return (await axios.delete(`match/del/${matchId}`, {withCredentials: true})).data;
// 	} catch (error) {
// 		console.log('error', error);
// 	}
// }

// export async function newMatch(param : Match_t) {
// 	console.log('creating new Match', param);
// 	try {
// 		return await axios.post('match/create', param);
// 	} catch (error) {
// 		console.log('error', error);
// 	}
// }