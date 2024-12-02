import { us } from '@/store/userStore';
import { LoggingState } from '@/type/user';
import axios from 'axios'
import { get } from 'svelte/store';

// Préfix des requests
axios.defaults.baseURL = import.meta.env.VITE_APIROOT_URL // "http://localhost:3000/api/"
axios.defaults.withCredentials = true;
// For the refresh process : https://www.youtube.com/watch?v=Y86k1Is45Uo
let err = false;

// (NE SERT À RIEN IL N'Y A PAS DE API/ROUTE/REFRESH)
// interceptor stands between request
axios.interceptors.response.use(resp => resp, async error => {
	if (error.response?.status === 401 && !err) {// pour envoyer les cookies
		err = true;
		const user = get(us);
		user.logState = LoggingState.unlogged
	// 	console.log('Nouvelle requete pour refresf le Token', );
	// 	const response = await axios.get('auth/refresh', {withCredentials: true})
	// 	if (response?.status === 200) {
	// 		axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
	// 		return axios(error.config); // <- reproduit la dernière request
	// 	}
	// } else if (error.response && error.response.status >= 400 && error.response.status < 500) {
	// 	// Si la réponse a un statut d'erreur client (400-499), rejeter la promesse avec l'erreur
	// 	return Promise.reject(error);
	}
	err = false;
	return error;
});

export { axios };