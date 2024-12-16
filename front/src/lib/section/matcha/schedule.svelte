<script lang="ts">
	import { us } from '@/store/userStore';
	import type { IUserOutput } from '@/type/shared_type/user';
	import { goto } from "$app/navigation";
	import { createMatchEvent } from '@/store/socketStore';
	import type { matchEventInput_t } from '@/type/shared_type/matchEvents';
	import { removeMatchEvent } from '@/store/socketStore';

  // Modèle pour un nouvel événement
  const newEvent = {
    guest: null,
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
  };

  function getInterlocutorFromInterlocutors(interlocutors: [IUserOutput, IUserOutput], userId: number) {
    if (interlocutors[0].id == userId)
      return interlocutors[1];
    else
      return interlocutors[0];
  }

  function getOtherUserFromMatchEventUsers(users: [IUserOutput, IUserOutput], userId: number) {
    if (users[0].id == userId)
      return users[1];
    else
      return users[0];
  }

  function getLocalTime(date: string) {
    if(date.indexOf('T') == -1)
      date = date.replace(' ', 'T') + 'Z';
    return new Date(date).toLocaleTimeString("fr-FR")
  }

  function getLocalDate(date: Date) {
    return new Date(date).toLocaleDateString("fr-FR")
  }

  function viewMatchProfil(profilId: number) {
		goto(`/app/frida/${profilId}`)
	}

  // Fonction pour ajouter un événement
  const addEvent = () => {
      if (newEvent.title && newEvent.date && newEvent.time && newEvent.guest != null) {
      const event: matchEventInput_t = {
        guestId: newEvent.guest.id,
        title: newEvent.title,
        location: newEvent.location,
        description: newEvent.description,
        date: new Date(newEvent.date + " " + newEvent.time).toISOString().slice(0, 19).replace("T", " ")
      }
      createMatchEvent(event);
      resetForm();
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  };

  // Réinitialisation du formulaire
  const resetForm = () => {
    newEvent.guest = null;
    newEvent.title = '';
    newEvent.date = '';
    newEvent.time = '';
    newEvent.location = '';
    newEvent.description = '';
  };

  // Suppression d'un événement
  const removeEvent = (matchEventToDeleteId: number) => {
    removeMatchEvent(matchEventToDeleteId);
    us.update((store) => {
				store.user.matchEvents = store.user.matchEvents.filter((matchEvent) => matchEvent.id !== matchEventToDeleteId);
				return {
					...store
				};
			});
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

    <div class="mb-4">
      <label for="guest" class="block text-sm font-medium text-gray-700">Invité(e)</label>
      <select bind:value={newEvent.guest} id="guest" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        {#each $us.user.chats as chat}
          <option value={getInterlocutorFromInterlocutors(chat.interlocutors, $us.user.id)}>{getInterlocutorFromInterlocutors(chat.interlocutors, $us.user.id).userName}</option>
        {/each}
    </select>
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

    {#if $us.user.matchEvents}
      <ul>
        {#each $us.user.matchEvents as event}
        <li class="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <button type="button" title="Voir profil" on:click={() => viewMatchProfil(getOtherUserFromMatchEventUsers(event.users, $us.user.id).id)}>
                <img src={"http://localhost:3000/api/user/picture/" + getOtherUserFromMatchEventUsers(event.users, $us.user.id).pictures[0].filename} alt={getOtherUserFromMatchEventUsers(event.users, $us.user.id).userName} class="w-16 h-16 rounded-full object-cover mr-4">
              </button>
            </div>
            <div class="flex-auto">
              <h3 class="font-semibold text-lg">{event.title}</h3>
              <p class="text-sm text-gray-500">
                Le {getLocalDate(event.date)} à {getLocalTime(event.date)}
              </p>
              <p class="text-sm text-gray-700">{event.location}</p>
              <p class="text-sm text-gray-600">{event.description}</p>
            </div>
            <button
              on:click={() => removeEvent(event.id)}
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