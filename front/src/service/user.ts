import {axios} from '@/service/interceptor/axios'
import type { UserChPw_ce } from '@/type/user';
import type { IMinimalUser, IUserOutput, IUserSelf } from '@/type/shared_type/user';
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
		delete  axios.defaults.headers.common['token'];
		const response = await axios.get('user/logout', {withCredentials: true});
	} catch (error) {
		console.log(`error`, error);
		throw error;
	}
}

/** get current User */
export async function getCurrentUser(): Promise<IUserSelf>  {
	try {
		const response = (await axios.get(`user/me`, {withCredentials: true})).data;
		console.log('getCurrentUser service response', response);
		if (response.contact)
			response.contact = deserializeContact(response.contact)
		return response;
	} catch (error) {
		throw error;
	}
}

/** get a User by id */
export async function getUser(id: number): Promise<IUserOutput> {
	try {
		const response = (await axios.get(`user/${id}`, {withCredentials: true})).data;
		console.log(`getUser n°me service response`, response);
		if (response.contact)
			response.contact = deserializeContact(response.contact)
		return response;
	} catch (error) {
		throw error;
	}
}

/** get current UserLocation */
export async function getUserLocation() {
	try {
		const data = (await axios.get("https://ipinfo.io/json?token=" + import.meta.env.VITE_LOC_SRV, {withCredentials: false})).data;
		console.log(`getUserLocation service data`, data);
		return data;
	} catch (error) {
		throw error;
	}
}

export async function createUser(user: IMinimalUser) {
	try {
		console.log('user', user);
		const response = await axios.post('user/create', user);
		// console.log('response', response);
	} catch (error) {
		console.log('ERROR Dans le createUser catch service');
		throw error;
	}
}

/** delete current User */
export async function deleteUser() {
	try {
		const response = (await axios.delete(`user/delete`, {withCredentials: true})).data;
		console.log(`deleteUser service response`, response);
		if (response.contact)
			response.contact = deserializeContact(response.contact)
		return response;
	} catch (error) {
		throw error;
	}
}

/** patch current User */
export async function updateUser(user: IUserOutput) {
	try {
		console.log(`updateUser service`, user);
		const response = (await axios.patch(`user/patch`, user, {withCredentials: true}));
	} catch (error) {
		console.log('ERROR updateUser() catch service');
		throw error;
	}
}

export async function resetUserPassword(email: string) {
	try {
		console.log(`resetPw service email`, email);
		const response = (await axios.get(`user/askresetpassword/${email}`));
	} catch (error) {
		console.log('ERROR reset User Password() catch service');
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

export async function delAvatar(pictureId:number) {
	try {
		const response = (await axios.delete(`user/picture/delete/${+pictureId}`, {withCredentials: true}));
		// console.log('response', response);
		// IMPORTANT PROBLEM : TJRS a faire la partie qui va modifier les info correspondant au user ds la db
		return response;
	} catch (error) {
		console.log('ERROR Dans le catch service');
		throw error;
	}
}