import {axios} from '@/service/interceptor/axios'
import type { User_t, UserChPw_ce } from '@/type/user';
import type { ITotalUser } from '@/type/shared_type/user';
function deserializeContact(data: any): any {
	return {
	  ...data,
	  dob: new Date(data.dob) // Conversion de la chaîne de date en objet Date
	};
}

export async function login(param : any) {
	try {
		return await axios.post(`user/login`, {
			userName : param.userName,
			password : param.password,
		});
	} catch (error) {
		console.log('error', error);
	}
}

export async function logout() {
	try {
		const response = await axios.get('user/logout', {withCredentials: true});
		delete  axios.defaults.headers.common['token'];
	} catch (error) {
		console.log(`error`, error);
		throw error;
	}
}

/** get current User */
export async function getCurrentUser() {
	try {
		const response = (await axios.get(`user/current`, {withCredentials: true})).data;
		console.log('getCurrentUser service response', response);
		if (response.contact)
			response.contact = deserializeContact(response.contact)
		return response;
	} catch (error) {
		throw error;
	}
}

/** get current User */
export async function getUser(id: number) {
	try {
		const response = (await axios.get(`user/me`, {withCredentials: true})).data;
		console.log(`getUser n°me service response`, response);
		if (response.contact)
			response.contact = deserializeContact(response.contact)
		return response;
	} catch (error) {
		throw error;
	}
}

export async function create(userName:string, password:string, email: string) {
	try {
		const response = (await axios.post('user/create', {
			userName,
			password,
			email
		}));
		// console.log('response', response);
	} catch (error) {
		// console.log('ERROR Dans le catch service');
		throw error;
	}
}

/** delete current User */
export async function deleteUser(id: number) {
	try {
		const response = (await axios.get(`user/delete`, {withCredentials: true})).data;
		console.log(`getUser n°me service response`, response);
		if (response.contact)
			response.contact = deserializeContact(response.contact)
		return response;
	} catch (error) {
		throw error;
	}
}

/** patch current User */
export async function updateUser(user: ITotalUser) {
	try {
		console.log(`updateUser service`, user);
		const response = (await axios.patch(`user/patch`, user, {withCredentials: true}));
	} catch (error) {
		console.log('ERROR updateUser() catch service');
		throw error;
	}
}

export async function changeUserPassword(changePw: UserChPw_ce) {
	try {
		console.log(`changePw service`, changePw);
		const response = (await axios.patch(`user/change-pw`, changePw, {withCredentials: true}));
	} catch (error) {
		console.log('ERROR change User Password() catch service');
		throw error;
	}
}

/** transmit avatar */
export async function picUpload(formData: FormData) {
	try {
		const response = (await axios.post(`user/picture/upload`, formData, {
			withCredentials: true,
			headers: {'Content-Type': 'multipart/form-data'}
		}));
		// console.log('response', response);
		return response;
	} catch (error) {
		console.log('ERROR Dans le catch service');
		throw error;
	}
}

export async function delAvatar() {
	try {
		const response = (await axios.delete(`user/avatar`, {withCredentials: true}));
		// console.log('response', response);
		// IMPORTANT PROBLEM : TJRS a faire la partie qui va modifier les info correspondant au user ds la db
		return response;
	} catch (error) {
		console.log('ERROR Dans le catch service');
		throw error;
	}
}