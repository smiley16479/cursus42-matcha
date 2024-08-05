<script lang="ts">
	// Données simulées pour les événements artistiques
	export let events = [
	  {
		id: 1,
		title: "Atelier de Peinture Inspiré de Frida Kahlo",
		description: "Apprenez les techniques de peinture qui caractérisent le style unique de Frida Kahlo.",
		image: "https://via.placeholder.com/400x300",
		date: "2024-08-15",
	  },
	  {
		id: 2,
		title: "Exposition d'Art Latino",
		description: "Découvrez des œuvres d'artistes latino-américains émergents.",
		image: "https://via.placeholder.com/400x300",
		date: "2024-09-01",
	  },
	  {
		id: 3,
		title: "Soirée Cinéma : Films de Frida Kahlo",
		description: "Projection de films documentaires sur la vie et l'œuvre de Frida Kahlo.",
		image: "https://via.placeholder.com/400x300",
		date: "2024-09-15",
	  },
	  {
		id: 4,
		title: "Discussion sur l'Art et la Résilience",
		description: "Une table ronde sur l'impact de l'art dans les moments difficiles.",
		image: "https://via.placeholder.com/400x300",
		date: "2024-09-20",
	  },
	];
  
	// Fonction pour gérer un clic sur un événement
	function viewEventDetails(event: any) {
	  alert(`Afficher les détails pour ${event.title}`);
	  // Ici, vous pourriez rediriger vers une page de détails ou afficher un modal
	}
  </script>
  
  <div class="bg-gray-50 min-h-screen">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	  <h1 class="text-3xl font-bold text-gray-900 mb-8">Événements Artistiques</h1>
	  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each events as event}
		  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
			<img src={event.image} alt={event.title} class="w-full h-48 object-cover">
			<div class="p-6">
			  <h2 class="text-xl font-bold text-gray-900">{event.title}</h2>
			  <p class="text-sm text-gray-600 mt-2">Date: {event.date}</p>
			  <p class="mt-3 text-gray-700">{event.description}</p>
			  <button on:click={() => viewEventDetails(event)} class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				Détails
			  </button>
			</div>
		  </div>
		{/each}
	  </div>
	</div>
  </div>