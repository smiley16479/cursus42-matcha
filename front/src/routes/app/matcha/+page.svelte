<script lang="ts">
	import { block, report, unlike } from "@/store/socketStore";
	import { Chat_c } from "@/type/shared_type/chat";
	import { app } from "../../../store/appStore";
	import { us } from "@/store/userStore";
	import { goto } from "$app/navigation";
  import Schedule from "@/lib/section/matcha/schedule.svelte";
	import Chat from "$lib/elem/chat/chat.svelte";
	import { type Notif_T, Notif_t_E } from "@/type/shared_type/notification";
	import { markNotificationRead } from "@/store/socketStore";
	import type { UserLikedBy_t, UserVisit_t } from "@/type/shared_type/user";
	import { get } from "svelte/store";
	import { decodeHtmlEntities } from "../../../service/util/sharedFunction";

	// Données simulées pour les matchs
	let matchOrChat = true;
	let chat : Chat_c;

	function markNotificationReadIfExists(notifType: Notif_t_E, payloadId: number) {
		const store = get(us);
		
		const notifToMarkRead = store.user?.notifications?.find((notif: Notif_T) => 
			notif.type === notifType && notif.payload.id == payloadId
		);

		if (notifToMarkRead)
			markNotificationRead(notifToMarkRead.id);

		if (notifType === Notif_t_E.MATCH) {
			const messagesNotifsToMarkRead = store.user?.notifications?.filter((notif: Notif_T) =>
				notif.type === Notif_t_E.MSG && notif.payload.chatId == payloadId
			);

			messagesNotifsToMarkRead.forEach((notif: Notif_T) => {
				markNotificationRead(notif.id);
			});
		}
	}

	function isThereANotificationAboutThis(notifType: Notif_t_E, payloadId: number) {
		const store = get(us);

		const notif = store.user?.notifications?.find((notif: Notif_T) => 
			notif.type === notifType && notif.payload.id == payloadId
		);

		if ((!notif) && notifType === Notif_t_E.MATCH) {
			const messagesNotifs = store.user?.notifications?.filter((notif: Notif_T) =>
				notif.type === Notif_t_E.MSG && notif.payload.chatId == payloadId
			);
			if (messagesNotifs.length != 0)
				return true;
		}

		if (notif)
			return true;
		return false;
	}

	// Fonction pour gérer un clic sur un match
	function viewMatchProfil(profilId: number) {
	  // alert(`Afficher les détails pour ${match.interlocutors.find(e => (e.id !== $us.user.id))?.userName}`);
		// goto(`/app/frida/${match.interlocutors.find(e => (e.id !== $us.user.id))?.id}}`)
		goto(`/app/frida/${profilId}`)

	}

	// Fonction pour gérer un clic sur un like
	function viewLikeProfil(like: UserLikedBy_t) {
	  // alert(`Afficher les détails pour ${match.interlocutors.find(e => (e.id !== $us.user.id))?.userName}`);
		// goto(`/app/frida/${match.interlocutors.find(e => (e.id !== $us.user.id))?.id}}`)
		markNotificationReadIfExists(Notif_t_E.LIKE, like.id);
		goto(`/app/frida/${like.likerUser.id}`)

	}

	// Fonction pour gérer un clic sur une visite
	function viewVisitProfil(visit: UserVisit_t) {
	  // alert(`Afficher les détails pour ${match.interlocutors.find(e => (e.id !== $us.user.id))?.userName}`);
		// goto(`/app/frida/${match.interlocutors.find(e => (e.id !== $us.user.id))?.id}}`)
		markNotificationReadIfExists(Notif_t_E.VISIT, visit.id);
		goto(`/app/frida/${visit.visiterUser.id}`)

	}

	function viewChat(match: Chat_c) {
		markNotificationReadIfExists(Notif_t_E.MATCH, match.id);
		console.log(`viewChat function`);
		chat = match;
		matchOrChat = false;
		$app.footer = false;
	}

	function deleteMatch(match: Chat_c) {
		if (confirm(`Vous êtes sur le point d'unmatch avec ${match.interlocutors.find(e => (e.id !== $us.user.id))?.userName}`)) {
			unlike(match.interlocutors[0].id == $us.user.id? match.interlocutors[1].id : match.interlocutors[0].id);
			$us.user.chats = $us.user.chats.filter(e => (e.id !== match.id))
			
			markNotificationReadIfExists(Notif_t_E.MATCH, match.id);
		}
	}

	function reportProfil(match: Chat_c) {
		const id = match.interlocutors.find(e => (e.id !== $us.user.id))?.id;
		if (id)
			report(id);
	}

	function blockProfil(match: Chat_c) {
		const id = match.interlocutors.find(e => (e.id !== $us.user.id))?.id;
		if (id)
			block(id);
	}

</script>

<!-- <pre>{JSON.stringify($us.user.chats, null, 2)}</pre>
<pre>{JSON.stringify(matches, null, 2)}</pre> -->

{#if matchOrChat}
	<div class="h-full bg-gray-100 p-6">
		<div class="max-w-3xl mx-auto bg-white rounded-lg shadow mb-6">
			<h1 class="text-2xl font-bold text-gray-800 mb-6">Mes Matchs</h1>
			<div class="space-y-4">
				{#each $us.user.chats as match, index}
					<button type="button" title="Chatter" on:click={() => viewChat(match)} class={`flex w-full items-center p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${isThereANotificationAboutThis(Notif_t_E.MATCH, match.id) ? 'border border-black bg-gray-200': 'bg-gray-50'}`}>
						<button class="flex min-w-20" type="button" title="Voir profil" on:click={() => viewMatchProfil(match.interlocutors[0].id === $us.user.id ? match.interlocutors[1].id : match.interlocutors[0].id)} >
							{#if match.interlocutors.find(e => (e.id !== $us.user.id))?.pictures?.[0].filename}
								<img src={"http://localhost:3000/api/user/picture/" + match.interlocutors.find(e => (e.id !== $us.user.id))?.pictures[0].filename} alt={match.interlocutors.find(e => (e.id !== $us.user.id))?.userName} class="w-16 h-16 rounded-full object-cover mr-4">
							{:else}
								<svg class="w-16 h-16" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512">
									<path fill-rule="nonzero" d="M256 0c70.69 0 134.7 28.66 181.02 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.7 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.7 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-21.49 301.51v-2.03c.16-13.46 1.48-24.12 4.07-32.05 2.54-7.92 6.19-14.37 10.97-19.25 4.77-4.92 10.51-9.39 17.22-13.46 4.31-2.74 8.22-5.78 11.68-9.18 3.45-3.36 6.19-7.27 8.23-11.69 2.02-4.37 3.04-9.24 3.04-14.62 0-6.4-1.52-11.94-4.57-16.66-3-4.68-7.06-8.28-12.04-10.87-5.03-2.54-10.61-3.81-16.76-3.81-5.53 0-10.81 1.11-15.89 3.45-5.03 2.29-9.25 5.89-12.55 10.77-3.3 4.87-5.23 11.12-5.74 18.74h-32.91c.51-12.95 3.81-23.92 9.85-32.91 6.1-8.99 14.13-15.8 24.08-20.42 10.01-4.62 21.08-6.9 33.16-6.9 13.31 0 24.89 2.43 34.84 7.41 9.96 4.93 17.73 11.83 23.27 20.67 5.48 8.84 8.28 19.1 8.28 30.88 0 8.08-1.27 15.34-3.81 21.79-2.54 6.45-6.1 12.24-10.77 17.27-4.68 5.08-10.21 9.54-16.71 13.41-6.15 3.86-11.12 7.82-14.88 11.93-3.81 4.11-6.56 8.99-8.28 14.58-1.73 5.63-2.69 12.59-2.84 20.92v2.03h-30.94zm16.36 65.82c-5.94-.04-11.02-2.13-15.29-6.35-4.26-4.21-6.35-9.34-6.35-15.33 0-5.89 2.09-10.97 6.35-15.19 4.27-4.21 9.35-6.35 15.29-6.35 5.84 0 10.92 2.14 15.18 6.35 4.32 4.22 6.45 9.3 6.45 15.19 0 3.96-1.01 7.62-2.99 10.87-1.98 3.3-4.57 5.94-7.82 7.87-3.25 1.93-6.86 2.9-10.82 2.94zM417.71 94.29C376.33 52.92 319.15 27.32 256 27.32c-63.15 0-120.32 25.6-161.71 66.97C52.92 135.68 27.32 192.85 27.32 256c0 63.15 25.6 120.33 66.97 161.71 41.39 41.37 98.56 66.97 161.71 66.97 63.15 0 120.33-25.6 161.71-66.97 41.37-41.38 66.97-98.56 66.97-161.71 0-63.15-25.6-120.32-66.97-161.71z"/>
								</svg>
							{/if}
						</button>
						<div class="flex-grow">
							<h2 class="hidden sm:block text-lg font-bold text-gray-900">{match.interlocutors.find(e => (e.id !== $us.user.id))?.userName}</h2>
							<p class="hidden md:block text-gray-600 text-sm">{decodeHtmlEntities(match.interlocutors.find(e => (e.id !== $us.user.id))?.biography || "")}</p>
						</div>
						<div class="hidden sm:block text-right">
							<p class="text-sm text-gray-500">Compatibilité</p>
							<p class="text-lg font-bold text-indigo-600">{100}%</p>
						</div>
						<button on:click={() => reportProfil(match)} title="fake account" class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Report
						</button>
						<button on:click={() => blockProfil(match)} class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Block
						</button>
						<button on:click={() => deleteMatch(match)} class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Delete
						</button>
					</button>
				{/each}
			</div>
		</div>
		<div class="max-w-3xl mx-auto bg-white rounded-lg shadow mb-6">
			<h1 class="text-2xl font-bold text-gray-800 mb-6" title="Profil(s) qui ont liké le mien">Mes Likes</h1>
			<div class="space-y-4">
				{#each $us.user.likedBy as like, index}
					<div class={`flex items-center p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${isThereANotificationAboutThis(Notif_t_E.LIKE, like.id) ? 'border border-black bg-gray-200': 'bg-gray-50'}`}>
						<button class="flex flex-grow min-w-20" type="button" title="Voir profil" on:click={() => viewLikeProfil(like)} >
							{#if like.likerUser.pictures?.[0].filename}
								<img src={"http://localhost:3000/api/user/picture/" + like.likerUser.pictures[0].filename} alt={like.likerUser.userName} class="w-16 h-16 rounded-full object-cover mr-4">
							{:else}
								<svg class="w-16 h-16" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512">
									<path fill-rule="nonzero" d="M256 0c70.69 0 134.7 28.66 181.02 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.7 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.7 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-21.49 301.51v-2.03c.16-13.46 1.48-24.12 4.07-32.05 2.54-7.92 6.19-14.37 10.97-19.25 4.77-4.92 10.51-9.39 17.22-13.46 4.31-2.74 8.22-5.78 11.68-9.18 3.45-3.36 6.19-7.27 8.23-11.69 2.02-4.37 3.04-9.24 3.04-14.62 0-6.4-1.52-11.94-4.57-16.66-3-4.68-7.06-8.28-12.04-10.87-5.03-2.54-10.61-3.81-16.76-3.81-5.53 0-10.81 1.11-15.89 3.45-5.03 2.29-9.25 5.89-12.55 10.77-3.3 4.87-5.23 11.12-5.74 18.74h-32.91c.51-12.95 3.81-23.92 9.85-32.91 6.1-8.99 14.13-15.8 24.08-20.42 10.01-4.62 21.08-6.9 33.16-6.9 13.31 0 24.89 2.43 34.84 7.41 9.96 4.93 17.73 11.83 23.27 20.67 5.48 8.84 8.28 19.1 8.28 30.88 0 8.08-1.27 15.34-3.81 21.79-2.54 6.45-6.1 12.24-10.77 17.27-4.68 5.08-10.21 9.54-16.71 13.41-6.15 3.86-11.12 7.82-14.88 11.93-3.81 4.11-6.56 8.99-8.28 14.58-1.73 5.63-2.69 12.59-2.84 20.92v2.03h-30.94zm16.36 65.82c-5.94-.04-11.02-2.13-15.29-6.35-4.26-4.21-6.35-9.34-6.35-15.33 0-5.89 2.09-10.97 6.35-15.19 4.27-4.21 9.35-6.35 15.29-6.35 5.84 0 10.92 2.14 15.18 6.35 4.32 4.22 6.45 9.3 6.45 15.19 0 3.96-1.01 7.62-2.99 10.87-1.98 3.3-4.57 5.94-7.82 7.87-3.25 1.93-6.86 2.9-10.82 2.94zM417.71 94.29C376.33 52.92 319.15 27.32 256 27.32c-63.15 0-120.32 25.6-161.71 66.97C52.92 135.68 27.32 192.85 27.32 256c0 63.15 25.6 120.33 66.97 161.71 41.39 41.37 98.56 66.97 161.71 66.97 63.15 0 120.33-25.6 161.71-66.97 41.37-41.38 66.97-98.56 66.97-161.71 0-63.15-25.6-120.32-66.97-161.71z"/>
								</svg>
							{/if}
						</button>
						<button class="flex flex-grow text-left w-full" type="button" title="Chatter" on:click={() => viewLikeProfil(like)} >
							<div class="flex-grow">
								<h2 class="hidden sm:block text-lg font-bold text-gray-900">{like.likerUser.userName}</h2>
								<p class="hidden md:block text-gray-600 text-sm">{like.likerUser.biography}</p>
							</div>
						</button>
							<div class="hidden sm:block text-right">
								<p class="text-sm text-gray-500">Compatibilité</p>
								<p class="text-lg font-bold text-indigo-600">{100}%</p>
							</div>
						<button on:click={() => report(like.likerUser.id)} title="fake account" class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Report
						</button>
						<button on:click={() => block(like.likerUser.id)} class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Delete
						</button>
					</div>
				{/each}
			</div>
		</div>
		<div class="max-w-3xl mx-auto bg-white rounded-lg shadow mb-6">
			<h1 class="text-2xl font-bold text-gray-800 mb-6" title="Profil(s) qui ont visité le mien">Mes Visites</h1>
			<div class="space-y-4">
				{#each $us.user.visits as visit, index}
					<div class={`flex items-center p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${isThereANotificationAboutThis(Notif_t_E.VISIT, visit.id) ? 'border border-black bg-gray-200': 'bg-gray-50'}`}>
						<button class="flex flex-grow min-w-20" type="button" title="Voir profil" on:click={() => viewVisitProfil(visit)} >
							{#if visit.visiterUser.pictures?.[0].filename}
								<img src={"http://localhost:3000/api/user/picture/" + visit.visiterUser.pictures[0].filename} alt={visit.visiterUser.userName} class="w-16 h-16 rounded-full object-cover mr-4">
							{:else}
								<svg class="w-16 h-16" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512">
									<path fill-rule="nonzero" d="M256 0c70.69 0 134.7 28.66 181.02 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.7 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.7 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-21.49 301.51v-2.03c.16-13.46 1.48-24.12 4.07-32.05 2.54-7.92 6.19-14.37 10.97-19.25 4.77-4.92 10.51-9.39 17.22-13.46 4.31-2.74 8.22-5.78 11.68-9.18 3.45-3.36 6.19-7.27 8.23-11.69 2.02-4.37 3.04-9.24 3.04-14.62 0-6.4-1.52-11.94-4.57-16.66-3-4.68-7.06-8.28-12.04-10.87-5.03-2.54-10.61-3.81-16.76-3.81-5.53 0-10.81 1.11-15.89 3.45-5.03 2.29-9.25 5.89-12.55 10.77-3.3 4.87-5.23 11.12-5.74 18.74h-32.91c.51-12.95 3.81-23.92 9.85-32.91 6.1-8.99 14.13-15.8 24.08-20.42 10.01-4.62 21.08-6.9 33.16-6.9 13.31 0 24.89 2.43 34.84 7.41 9.96 4.93 17.73 11.83 23.27 20.67 5.48 8.84 8.28 19.1 8.28 30.88 0 8.08-1.27 15.34-3.81 21.79-2.54 6.45-6.1 12.24-10.77 17.27-4.68 5.08-10.21 9.54-16.71 13.41-6.15 3.86-11.12 7.82-14.88 11.93-3.81 4.11-6.56 8.99-8.28 14.58-1.73 5.63-2.69 12.59-2.84 20.92v2.03h-30.94zm16.36 65.82c-5.94-.04-11.02-2.13-15.29-6.35-4.26-4.21-6.35-9.34-6.35-15.33 0-5.89 2.09-10.97 6.35-15.19 4.27-4.21 9.35-6.35 15.29-6.35 5.84 0 10.92 2.14 15.18 6.35 4.32 4.22 6.45 9.3 6.45 15.19 0 3.96-1.01 7.62-2.99 10.87-1.98 3.3-4.57 5.94-7.82 7.87-3.25 1.93-6.86 2.9-10.82 2.94zM417.71 94.29C376.33 52.92 319.15 27.32 256 27.32c-63.15 0-120.32 25.6-161.71 66.97C52.92 135.68 27.32 192.85 27.32 256c0 63.15 25.6 120.33 66.97 161.71 41.39 41.37 98.56 66.97 161.71 66.97 63.15 0 120.33-25.6 161.71-66.97 41.37-41.38 66.97-98.56 66.97-161.71 0-63.15-25.6-120.32-66.97-161.71z"/>
								</svg>
							{/if}
						</button>
						<button class="flex flex-grow text-left w-full" type="button" title="Chatter" on:click={() => viewVisitProfil(visit)} >
							<div class="flex-grow">
								<h2 class="hidden sm:block text-lg font-bold text-gray-900">{visit.visiterUser.userName}</h2>
								<p class="hidden md:block text-gray-600 text-sm">{visit.visiterUser.biography}</p>
							</div>
						</button>
							<div class="hidden sm:block text-right">
								<p class="text-sm text-gray-500">Compatibilité</p>
								<p class="text-lg font-bold text-indigo-600">{100}%</p>
							</div>
						<button on:click={() => report(visit.visiterUser.id)} title="fake account" class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Report
						</button>
						<!-- <button on:click={() => block(visit.visiterUser.id)} class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
							Delete
						</button> -->
					</div>
				{/each}
			</div>
		</div>
		

		<!-- Notifications -->
		<div class="max-w-3xl mx-auto bg-white rounded-lg shadow">
			<h1 class="text-2xl font-bold text-gray-800 mb-6" title="Profil que j'ai liké">Mes Notifications</h1>
			<div class="space-y-4">
				{#if $us.user.notifications.length > 0}
					{#each $us.user.notifications as notification}
						<div class="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
							<div class="flex-grow">
								{#if notification.involvedUser.pictures?.[0].filename}
								<img src={"http://localhost:3000/api/user/picture/" + notification.involvedUser.pictures[0].filename} alt={notification.involvedUser.userName} class="w-16 h-16 rounded-full object-cover mr-4">
								{/if}
								<h2 class="text-lg font-bold text-gray-900">{notification.type}</h2>
								<p class="text-gray-600 text-sm">De {notification.involvedUser.userName}</p>
							</div>
							<button on:click={() => markNotificationReadIfExists(notification.type, notification.payload.id)} class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
								Marquer comme lu
							</button>
						</div>
					{/each}
				{:else}
					<p class="text-gray-500 text-center">Aucune notification pour le moment.</p>
				{/if}
			</div>
		</div>

		<div class="mt-4">
			<Schedule/>
		</div>
	</div>
{:else}
	<Chat bind:chat bind:matchOrChat/>
{/if}
