<script lang="ts">
	import { writable } from "svelte/store";
  
	// Données simulées pour les matchs
	let matches = writable([
	  {
		id: 1,
		name: "Alice",
		photo: "https://via.placeholder.com/150",
		bio: "Amoureuse des animaux et passionnée par la musique.",
		compatibility: 85,
	  },
	  {
		id: 2,
		name: "Bob",
		photo: "https://via.placeholder.com/150",
		bio: "Grand amateur de randonnée et de cuisine asiatique.",
		compatibility: 90,
	  },
	  {
		id: 3,
		name: "Charlie",
		photo: "https://via.placeholder.com/150",
		bio: "Sportif et amateur de littérature classique.",
		compatibility: 70,
	  },
	]);
  
	// Fonction pour gérer un clic sur un match
	function viewMatchDetails(match: any) {
	  alert(`Afficher les détails pour ${match.name}`);
	  // Ici, vous pourriez rediriger vers une page de détails ou afficher un modal
	}
  </script>
  
  <style>
	/* Styles supplémentaires, le cas échéant */
  </style>
  
  <div class="h-full bg-gray-100 p-6">
	<div class="max-w-3xl mx-auto bg-white p-4 rounded-lg shadow">
	  <h1 class="text-2xl font-bold text-gray-800 mb-6">Mes Matchs</h1>
	  <div class="space-y-4">
		{#each $matches as match}
		  <div class="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
			<img src={match.photo} alt={match.name} class="w-16 h-16 rounded-full object-cover mr-4">
			<div class="flex-grow">
			  <h2 class="text-lg font-bold text-gray-900">{match.name}</h2>
			  <p class="text-gray-600 text-sm">{match.bio}</p>
			</div>
			<div class="text-right">
			  <p class="text-sm text-gray-500">Compatibilité</p>
			  <p class="text-lg font-bold text-indigo-600">{match.compatibility}%</p>
			</div>
			<button on:click={() => viewMatchDetails(match)} class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
			  Voir Détails
			</button>
		  </div>
		{/each}
	  </div>
	</div>
  </div>