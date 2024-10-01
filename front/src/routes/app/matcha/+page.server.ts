import { parseCookies } from '@/service/util/sharedFunction';
import axios from 'axios'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, request }) {
	// console.log('params', params.chat);
	const cookieHeader = request.headers.get('cookie') || '';
	const cookies = parseCookies(cookieHeader);
	const authentication_cookie = cookies['Authentication'];

/* 	const apiUrl = `http://back:3000/api/`
	const res = await axios.get(`chat`, {
		baseURL: apiUrl,
		headers: {
			Cookie: `Authentication=${authentication_cookie};`
		}
	}); 
	// console.log('%cparams.emitterSlug', 'color: blue;', res.data);
	const axios_responseJson = JSON.stringify(res.data, undefined, 2);

	return { item: res.data, params : res.data || null }; */
}