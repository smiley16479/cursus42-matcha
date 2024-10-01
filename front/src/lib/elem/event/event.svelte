<script lang="ts">
	import EventModal from "../../component/modal/eventModal.svelte";
	import { events } from "./eventList";
  let showModal = false;
	let selectedEvent: {
    image: string;
    title: string;
    description: string;
    txt: string;
    date: string;
    location: string;
    time: string;
  } = {
		image: '',
    title: '',
    description: '',
    txt: '',
    date: '',
    location: '',
    time: ''
  };
  
	function viewEventDetails(event: any) {
		selectedEvent = event;
    showModal = true;
	}
  </script>
  
<div class="bg-gray-50 min-h-screen">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	  <h1 class="text-3xl font-bold text-gray-900 mb-8">Événements Artistiques</h1>
	  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each events as event, index}
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
	<EventModal bind:showModal eventDetails={selectedEvent} />
</div>