<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  type Event = {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
  };

  // Liste des événements planifiés
  const events = writable<Event[]>([]);

  // Modèle pour un nouvel événement
  const newEvent: Event = {
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
  };

  // Fonction pour ajouter un événement
  const addEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      events.update((current) => [...current, { ...newEvent }]);
      resetForm();
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  };

  // Réinitialisation du formulaire
  const resetForm = () => {
    newEvent.title = '';
    newEvent.date = '';
    newEvent.time = '';
    newEvent.location = '';
    newEvent.description = '';
  };

  // Suppression d'un événement
  const removeEvent = (index: number) => {
    events.update((current) => current.filter((_, i) => i !== index));
  };
</script>

<div class="p-6 bg-gray-100 min-h-screen">
  <!-- Formulaire pour ajouter un événement -->
  <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mb-8">
    <h2 class="text-2xl font-bold mb-4">Planifier un événement</h2>

    <div class="mb-4">
      <label for="title" class="block text-sm font-medium text-gray-700">Titre*</label>
      <input
        id="title"
        type="text"
        bind:value={newEvent.title}
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Exemple : Dîner romantique"
      />
    </div>

    <div class="mb-4">
      <label for="date" class="block text-sm font-medium text-gray-700">Date*</label>
      <input
        id="date"
        type="date"
        bind:value={newEvent.date}
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div class="mb-4">
      <label for="time" class="block text-sm font-medium text-gray-700">Heure*</label>
      <input
        id="time"
        type="time"
        bind:value={newEvent.time}
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div class="mb-4">
      <label for="location" class="block text-sm font-medium text-gray-700">Lieu</label>
      <input
        id="location"
        type="text"
        bind:value={newEvent.location}
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Exemple : Paris, Café Central"
      />
    </div>

    <div class="mb-4">
      <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        id="description"
        bind:value={newEvent.description}
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Ajoutez des détails sur l'événement"
      ></textarea>
    </div>

    <button
      on:click={addEvent}
      class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Ajouter l'événement
    </button>
  </div>

  <!-- Liste des événements -->
  <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
    <h2 class="text-2xl font-bold mb-4">Événements planifiés</h2>

    {#if $events.length > 0}
      <ul>
        {#each $events as event, index}
          <li class="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 class="font-semibold text-lg">{event.title}</h3>
              <p class="text-sm text-gray-500">
                {event.date} à {event.time}
              </p>
              <p class="text-sm text-gray-700">{event.location}</p>
              <p class="text-sm text-gray-600">{event.description}</p>
            </div>
            <button
              on:click={() => removeEvent(index)}
              class="text-red-600 hover:underline"
            >
              Supprimer
            </button>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-gray-500">Aucun événement planifié pour le moment.</p>
    {/if}
  </div>
</div>