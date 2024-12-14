import {axios} from '@/service/interceptor/axios'
import type { IUserOutput } from '@/type/shared_type/user';


/** Get all match from an userId */
export async function browse(searchPref: any): Promise<IUserOutput[]| null>{
	try {
		return (await axios.post(`browse`, searchPref, {withCredentials: true})).data as IUserOutput[];
	} catch (error) {
		console.log('error', error);
		return null;
	}
}

/** Get all candidates from specified pref */
export async function research(searchPref: any): Promise<IUserOutput[]| null>{
	try {
		return (await axios.post(`research`, searchPref, {withCredentials: true})).data as IUserOutput[];
	} catch (error) {
		console.log('error', error);
		return null;
	}
}