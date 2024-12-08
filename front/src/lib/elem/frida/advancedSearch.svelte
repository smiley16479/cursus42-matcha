<script lang="ts">
	import { browse } from '@/service/browse';
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
      sortingOn:  "score",
      sortingType:  "desc",
    }

    try {
      $app.loadingSpinner = true;
      const result = await browse({...pref});
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
    <button
      on:click={() => (swipeFilter = !swipeFilter)}
      class={`mt-4 py-2 px-4 rounded-lg font-bold transition-all duration-300 
        ${swipeFilter 
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
        }`}
    >
      filtres sur les swipes {swipeFilter ? "activés" : "désactivés"}
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
              <td class="p-2 border border-gray-300"><img class="w-24" src="http://localhost:3000/api/user/picture/{match?.pictures?.[0]?.filename}" alt="{match.firstName}"></td>
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