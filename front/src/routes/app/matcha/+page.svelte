<script lang="ts">
	import { goto } from "$app/navigation";
	import { block, report, unlike } from "@/store/socketStore";
	import { app } from "../../../store/appStore";
	import { writable } from "svelte/store";
  
  /** @type {import('./$types').PageData} */
  export let data : any;

	// Données simulées pour les matchs
	let matches = writable([
	{
		id: 1,
		name: "Alice",
		photo: "/profil/0/1.webp",
		bio: "Amoureuse des animaux et passionnée par la musique.",
		compatibility: 85,
	},
	{
		id: 2,
		name: "Bob",
		photo: "/profil/1/1.webp",
		bio: "Grand amateur de randonnée et de cuisine asiatique.",
		compatibility: 90,
	},
	{
		id: 3,
		name: "Charlie",
		photo: "/profil/3/1.webp",
		bio: "Sportif et amateur de littérature classique.",
		compatibility: 70,
	  },
	]);

	let notifications = [
  { id: 1, title: "Nouveau match !", message: "Vous avez un match avec Valentina." },
  { id: 2, title: "Message reçu", message: "Pauline vous a envoyé un message." },
	{ id: 1, title: "Nouveau match !", message: "Vous avez un match avec Valentina." },
  { id: 2, title: "Message reçu", message: "Pauline vous a envoyé un message." },
	{ id: 1, title: "Nouveau match !", message: "Vous avez un match avec Valentina." },
  { id: 2, title: "Message reçu", message: "Pauline vous a envoyé un message." },
	{ id: 1, title: "Nouveau match !", message: "Vous avez un match avec Valentina." },
  { id: 2, title: "Message reçu", message: "Pauline vous a envoyé un message." },
];
  
		function markAsRead(notification: any) {
			
		}

	// Fonction pour gérer un clic sur un match
	function viewMatchDetails(match: any) {
	  alert(`Afficher les détails pour ${match.name}`);
		goto(`/app/frida/search/${match.id}`)
	  // Ici, vous pourriez rediriger vers une page de détails ou afficher un modal
	}

	function viewChat(match: any) {
		console.log(`viewChat function`);
		$app.footer = false;
		goto(`matcha/${match.id}`);
	}

	function deleteMatch(match: any) {
		if (confirm(`Vous êtes sur le point d'unmatch avec ${match.name}\nPAS ENCORE DEV`)) {
			unlike(match.id);
			$matches = $matches.filter(e => (e.id !== match.id))
		}
	}
</script>

<div class="h-full bg-gray-100 p-6">
	<div class="max-w-3xl mx-auto bg-white rounded-lg shadow">
		<h1 class="text-2xl font-bold text-gray-800 mb-6">Mes Matchs</h1>
		<div class="space-y-4">
			{#each $matches as match, index}
				<div class={`flex items-center p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${index === 0 ? 'border border-black bg-gray-200': 'bg-gray-50'}`}>
					<button class="flex flex-grow min-w-20" type="button" title="Voir profil" on:click={() => viewMatchDetails(match)} >
						<img src={match.photo} alt={match.name} class="w-16 h-16 rounded-full object-cover mr-4">
					</button>
					<button class="flex flex-grow text-left w-full" type="button" title="Chatter" on:click={() => viewChat(match)} >
						<div class="flex-grow">
							<h2 class="hidden sm:block text-lg font-bold text-gray-900">{match.name}</h2>
							<p class="hidden md:block text-gray-600 text-sm">{match.bio}</p>
						</div>
					</button>
						<div class="hidden sm:block text-right">
							<p class="text-sm text-gray-500">Compatibilité</p>
							<p class="text-lg font-bold text-indigo-600">{match.compatibility}%</p>
						</div>
					<!--	<button on:click={() => viewMatchDetails(match)} class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap">
						Profil
					</button> -->
					<button on:click={() => report(match.id)} title="fake account" class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						Report
					</button>
					<button on:click={() => block(match.id)} class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						Block
					</button>
					<button on:click={() => deleteMatch(match)} class="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						Delete
					</button>
				</div>
			{/each}
		</div>
	</div>
	<div class="max-w-3xl mx-auto bg-white rounded-lg shadow">
		<h1 class="text-2xl font-bold text-gray-800 mb-6" title="Profil(s) qui ont liké le mien">Mes Likes</h1>
		<div class="space-y-4">
		</div>
	</div>
	<div class="max-w-3xl mx-auto bg-white rounded-lg shadow">
		<h1 class="text-2xl font-bold text-gray-800 mb-6" title="Profil(s) qui ont visité le mien">Mes Visites</h1>
		<div class="space-y-4">
		</div>
	</div>
	

	<!-- Section Notifications -->
		<div class="max-w-3xl mx-auto bg-white rounded-lg shadow">
			<h1 class="text-2xl font-bold text-gray-800 mb-6" title="Profil que j'ai liké">Mes Crushs</h1>
			<div class="space-y-4">
				{#if notifications.length > 0}
					{#each notifications as notification}
						<div class="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
							<div class="flex-grow">
								<h2 class="text-lg font-bold text-gray-900">{notification.title}</h2>
								<p class="text-gray-600 text-sm">{notification.message}</p>
							</div>
							<button on:click={() => markAsRead(notification)} class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
								Marquer comme lu
							</button>
						</div>
					{/each}
				{:else}
					<p class="text-gray-500 text-center">Aucune notification pour le moment.</p>
				{/if}
			</div>
		</div>
</div>