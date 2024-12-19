<script lang="ts">
	import { browse, research } from '@/service/browse';
	import { us } from '@/store/userStore';
  import { writable, type Writable } from 'svelte/store';
  import MapLocation from '@/lib/component/map/mapLocation.svelte';
	import { ESexualPref, type IUserOutput } from '@/type/shared_type/user';
	import { app } from '@/store/appStore';
	import MultiSelect2 from '@/lib/component/setting/multiSelect2.svelte';
	import { haversine } from '@/service/util/sharedFunction';
  import { getContext, onMount } from 'svelte';

  export let matches: Writable<IUserOutput[]>;
  // Critères de recherche
  let ageGap = 5;
  let fameRatingGap = 10;
  let distanceGap = 10;
  let genre: ESexualPref;
  let geolocation = false;
  let swipeFilter = false;
  let location = '';
  let interests: string[] = [];

  // Critères de tri/filtre
  let sortKey = 'age';
  let filter: string[];
  let filterCriteria = { genre: ESexualPref.Both ,minAge: 0, maxAge: 0, location: 0, fameRating: 0 };

  // $: filter, sortMatches()
  const pos: {lng: number, lat: number} = {lng: $us.user.longitude, lat: $us.user.latitude};

  async function searchMatches() {

    const pref = {
      requiredGender: genre,
      sexualPref: genre,
      matchAgeMin: $us.user.age - ageGap > 0   ? $us.user.age - ageGap : 0,
      matchAgeMax: $us.user.age + ageGap < 100 ? $us.user.age + ageGap : 100,
      minFameRate: $us.user.fameRate - fameRatingGap > 0   ? $us.user.fameRate - fameRatingGap : 0,
      maxFameRate: $us.user.fameRate + fameRatingGap < 100 ? $us.user.fameRate + fameRatingGap : 100,
      maxDistance: distanceGap,
      interests,
      latitude: pos.lat,
      longitude: pos.lng,
      nbRequiredProfiles: 1000,
      offset: 0,
      sortingOn: swipeFilter ? "fameRate" : "score",
      sortingType:  "desc",
    }

    try {
      $app.loadingSpinner = true;
      const result = await (swipeFilter ? browse({...pref}) : research({...pref}));
      if (result)
        matches.set(result);
      $app.cardIndex = 0
    } catch (error) {
      console.log(`error`, error);
    }
    $app.loadingSpinner = false;
    geolocation = false;
  }

  function sortMatches() {
    matches.update(items =>
      [...items].sort((a, b) => {
        if (sortKey === 'age') return a.age - b.age;
        if (sortKey === 'genre') return parseInt(a.gender) - parseInt(b.gender); // PROBLEM
        if (sortKey === 'distance') return haversine(pos.lat, pos.lng, a.latitude, a.longitude) - haversine(pos.lat, pos.lng, b.latitude, b.longitude);
        if (sortKey === 'fameRating') return  b.fameRate - a.fameRate;
        if (sortKey === 'tags') return b.interests.filter(interest => interests.includes(interest)).length - a.interests.filter(interest => interests.includes(interest)).length;
        return 0;
      })
    );
  }

  function filterMatches() {
    matches.update(items =>
      items.filter(match => {
        const { minAge, maxAge, location, fameRating } = filterCriteria;
        return (
          (minAge === 0 || match.age >= minAge) &&
          (maxAge === 0 || match.age <= maxAge) &&
          (location === 0 || location > haversine(pos.lat, pos.lng, match.latitude, match.longitude)) &&
          (fameRating === 0 || match.fameRate >= fameRating) 
        );
      })
    );
  }

</script>

<div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
  <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Recherche de Correspondances</h1>

  <!-- Formulaire de Recherche -->
  <form
    on:submit|preventDefault={searchMatches}
    class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
  >
    <div>
      <label class="block text-gray-700">Écart d'âge (ans)
        <input
          type="number"
          bind:value={ageGap}
          class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
        />
      </label>
    </div>
    <div>
      <label class="block text-gray-700">Écart de popularité
        <input
          type="number"
          bind:value={fameRatingGap}
          class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
        />
      </label>
    </div>
    <div>
      <label class="block text-gray-700">Genre
        <select
          bind:value={genre}
          class="mt-1 p-2.5 w-full border bg-white border-gray-300 rounded-lg"
        >
        <option value="Male">Homme</option>
        <option value="Female">Femme</option>
          <option value="Both">Les 2 mon général !</option>
        </select>
      </label>
    </div>
    <div>
      <MultiSelect2 bind:selected={interests}/>
    </div>
    <div class="md:col-span-2">
      <label class="block text-gray-700">Écart de distance
        <input
          type="number"
          bind:value={distanceGap}
          class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
        />
      </label>
    </div>
    <div class="w-full md:col-span-2">
      <label for="geolocation" class="block text-gray-700">
        <input bind:checked={geolocation} id="geolocation" name="geolocation" type="checkbox"
        class="mt-6  h-4 w-4 border-gray-300 rounded focus:ring-indigo-500">
          Changer ma géolocalisation
      </label>
      {#if geolocation}
      <div class="mb-6 w-full h-full">
        <MapLocation searchMode={true} {pos}/>
      </div>
    {/if}

    </div>

    <button
      on:click={() => (swipeFilter = !swipeFilter)}
      title="votre profil sera pris en compte pour la recherche"
      class={`mt-4 py-2 px-4 rounded-lg font-bold transition-all duration-300 
        ${swipeFilter 
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
        }`}
    >
      aplliquer la recherche aux swipes ({swipeFilter ? "activés" : "désactivés"})
    </button>
    <button
      type="submit"
      class="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
    >
      Rechercher
    </button>
  </form>

  <!-- Options de tri et de filtre -->
  <div class="mb-6">
    <h2 class="text-xl font-semibold text-gray-800 mt-4">Options de Tri</h2>
    <div>
      <label class="block text-gray-700">Trier par
        <select
          bind:value={sortKey}
          on:change={sortMatches}
          class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
        >
          <option value="age">Âge</option>
          <option value="genre">Genre</option>
          <option value="distance">Localisation</option>
          <option value="fameRating">Popularité</option>
          <option value="tags">Tags</option>
        </select>
      </label>
    </div>
    <h2 class="text-xl font-semibold text-gray-800 mt-4">Options de Filtre</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      

       <div>
              <label class="block text-gray-700">Filtrer par genre
                <select
                  on:change={e => (filterCriteria.minAge = +e.currentTarget.value)}
                  class="mt-1 p-2.5 w-full border bg-white border-gray-300 rounded-lg"
                >
                <option value="Male">Homme</option>
                <option value="Female">Femme</option>
                  <option value="Both">Les 2 mon général !</option>
                </select>
              </label>
            </div>
            <div>
              <label class="block text-gray-700">Filtrer par âge
                <div class="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    on:change={e => (filterCriteria.minAge = +e.currentTarget.value)}
                    class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    on:change={e => (filterCriteria.maxAge = +e.currentTarget.value)}
                    class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                  />
                </div>
              </label>
            </div>
            <div>
              <label class="block text-gray-700">Filtrer par localisation
                <input
                  type="number"
                  placeholder="Distance (km)"
                  on:change={e => (filterCriteria.location = +e.currentTarget.value)}
                  class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
              </label>
            </div>
            <div>
              <label class="block text-gray-700">Filtrer par popularité
                <input
                type="number"
                  placeholder="[popularité,100]"
                  on:change={e => (filterCriteria.fameRating = +e.currentTarget.value)}
                  class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
              </label>
      </div>
    </div>
    <button
      on:click={filterMatches}
      class="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
    >
      Appliquer les filtres
    </button>
    <!-- <LocationSelector/> -->
  </div>

  <!-- Résultats -->
  <div>
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Résultats</h2>
    {#if $matches.length === 0}
      <p class="text-gray-500">Aucun résultat trouvé.</p>
    {:else}
      <table class="w-full border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 border border-gray-300">Âge</th>
            <th class="p-2 border border-gray-300">genre</th>
            <th class="p-2 border border-gray-300">Distance</th>
            <th class="p-2 border border-gray-300">Popularité</th>
            <th class="p-2 border border-gray-300">Avatar</th>
            <th class="p-2 border border-gray-300">Nom</th>
            <th class="p-2 border border-gray-300">Tags</th>
          </tr>
        </thead>
        <tbody>
          {#each $matches as match}
            <tr>
              <td class="p-2 border border-gray-300">{match.age}</td>
              <td class="p-2 border border-gray-300">{match.gender}</td>
              <td class="p-2 border border-gray-300">{haversine(pos.lat, pos.lng, match.latitude, match.longitude).toFixed(0)} km</td>
              <td class="p-2 border border-gray-300">{match.fameRate}</td>
              <td class="p-2 border border-gray-300">
                <!-- <img class="w-24" src="http://localhost:3000/api/user/picture/{match?.pictures?.[0]?.filename}" alt="{match.firstName}"> -->
                {#if match?.pictures?.[0]?.filename && !match?.pictures?.[0]?.filename.includes('undefined')}
                  <img src={match?.pictures?.[0]?.filename.includes('localhost') ? match?.pictures?.[0]?.filename : "http://localhost:3000/api/user/picture/" + match?.pictures?.[0]?.filename } alt="Shanay" class="w-11 h-11 object-cover rounded-full">
                {:else}
                  <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512">
                    <path fill-rule="nonzero" d="M256 0c70.69 0 134.7 28.66 181.02 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.7 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.7 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-21.49 301.51v-2.03c.16-13.46 1.48-24.12 4.07-32.05 2.54-7.92 6.19-14.37 10.97-19.25 4.77-4.92 10.51-9.39 17.22-13.46 4.31-2.74 8.22-5.78 11.68-9.18 3.45-3.36 6.19-7.27 8.23-11.69 2.02-4.37 3.04-9.24 3.04-14.62 0-6.4-1.52-11.94-4.57-16.66-3-4.68-7.06-8.28-12.04-10.87-5.03-2.54-10.61-3.81-16.76-3.81-5.53 0-10.81 1.11-15.89 3.45-5.03 2.29-9.25 5.89-12.55 10.77-3.3 4.87-5.23 11.12-5.74 18.74h-32.91c.51-12.95 3.81-23.92 9.85-32.91 6.1-8.99 14.13-15.8 24.08-20.42 10.01-4.62 21.08-6.9 33.16-6.9 13.31 0 24.89 2.43 34.84 7.41 9.96 4.93 17.73 11.83 23.27 20.67 5.48 8.84 8.28 19.1 8.28 30.88 0 8.08-1.27 15.34-3.81 21.79-2.54 6.45-6.1 12.24-10.77 17.27-4.68 5.08-10.21 9.54-16.71 13.41-6.15 3.86-11.12 7.82-14.88 11.93-3.81 4.11-6.56 8.99-8.28 14.58-1.73 5.63-2.69 12.59-2.84 20.92v2.03h-30.94zm16.36 65.82c-5.94-.04-11.02-2.13-15.29-6.35-4.26-4.21-6.35-9.34-6.35-15.33 0-5.89 2.09-10.97 6.35-15.19 4.27-4.21 9.35-6.35 15.29-6.35 5.84 0 10.92 2.14 15.18 6.35 4.32 4.22 6.45 9.3 6.45 15.19 0 3.96-1.01 7.62-2.99 10.87-1.98 3.3-4.57 5.94-7.82 7.87-3.25 1.93-6.86 2.9-10.82 2.94zM417.71 94.29C376.33 52.92 319.15 27.32 256 27.32c-63.15 0-120.32 25.6-161.71 66.97C52.92 135.68 27.32 192.85 27.32 256c0 63.15 25.6 120.33 66.97 161.71 41.39 41.37 98.56 66.97 161.71 66.97 63.15 0 120.33-25.6 161.71-66.97 41.37-41.38 66.97-98.56 66.97-161.71 0-63.15-25.6-120.32-66.97-161.71z"/>
                  </svg>
                {/if}
              </td>
              <td class="p-2 border border-gray-300">{match.userName}</td>
              <td class="p-2 border border-gray-300">{match.interests.join(', ')}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>
<div class="min-h-12"></div>