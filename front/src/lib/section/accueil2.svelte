<script lang="ts">
	// Exemples de données pour les sections de la page d'accueil
	export let featuredEvent = {
	  title: "Atelier de Peinture Inspiré de Frida Kahlo",
	  description: "Rejoignez-nous pour un atelier de peinture où nous explorerons le style unique de Frida Kahlo.",
	  image: "https://via.placeholder.com/600x400",
	  date: "2024-08-15",
	};
  
	export let upcomingEvents = [
	  {
		id: 1,
		title: "Exposition d'Art Latino",
		date: "2024-09-01",
	  },
	  {
		id: 2,
		title: "Soirée Cinéma : Films de Frida Kahlo",
		date: "2024-09-15",
	  },
	  {
		id: 3,
		title: "Discussion sur l'Art et la Résilience",
		date: "2024-09-20",
	  },
	];
  </script>
  
  <style>
	/* Styles supplémentaires, le cas échéant */
  </style>
  
  <div class="bg-gray-50 min-h-screen">
	<!-- Hero Section -->
	<section class="bg-white py-12">
	  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="lg:text-center">
		  <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Rencontres et Art</h2>
		  <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
			Explorez votre créativité et trouvez votre âme sœur
		  </p>
		  <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
			Une communauté pour les passionnés d'art qui cherchent à se connecter et à s'inspirer.
		  </p>
		</div>
	  </div>
	</section>
  
	<!-- Featured Event -->
	<section class="bg-yellow-100 py-12">
	  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="lg:flex lg:items-center lg:justify-between">
		  <div class="lg:w-1/2">
			<h3 class="text-2xl font-bold text-gray-900">{featuredEvent.title}</h3>
			<p class="mt-4 text-gray-700">{featuredEvent.description}</p>
			<p class="mt-2 text-sm text-gray-600">Date: {featuredEvent.date}</p>
			<button class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
			  En savoir plus
			</button>
		  </div>
		  <div class="lg:w-1/2 lg:ml-10">
			<img src={featuredEvent.image} alt="Atelier de Peinture" class="rounded-lg shadow-lg">
		  </div>
		</div>
	  </div>
	</section>
  
	<!-- Upcoming Events -->
	<section class="bg-gray-100 py-12">
	  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<h3 class="text-2xl font-bold text-gray-900">Événements à venir</h3>
		<ul class="mt-6 space-y-4">
		  {#each upcomingEvents as event}
			<li class="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
			  <div>
				<h4 class="text-lg font-bold text-gray-900">{event.title}</h4>
				<p class="mt-1 text-sm text-gray-600">Date: {event.date}</p>
			  </div>
			  <button class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				Détails
			  </button>
			</li>
		  {/each}
		</ul>
	  </div>
	</section>
  </div>