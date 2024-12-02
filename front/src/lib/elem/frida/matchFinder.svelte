<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // Données fictives pour les correspondances
  const matches = writable<{age:number, location:string, fameRating: number, tags: string[]}[]>([]);

  // Critères de recherche
  let ageGap = 5;
  let fameRatingGap = 10;
  let location = '';
  let interests = '';

  // Critères de tri/filtre
  let sortKey = 'age';
  let filterCriteria = { minAge: null, maxAge: null, location: '', fameRating: null, tags: '' };

  async function searchMatches() {
    const response = await fetch('/api/search-matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ageGap, fameRatingGap, location, interests: interests.split(',').map(tag => tag.trim()) })
    });
    const data = await response.json();
    matches.set(data);
  }

  function sortMatches() {
    matches.update(items =>
      [...items].sort((a, b) => {
        if (sortKey === 'age') return a.age - b.age;
        if (sortKey === 'location') return a.location.localeCompare(b.location);
        if (sortKey === 'fameRating') return b.fameRating - a.fameRating;
        if (sortKey === 'tags') return a.tags.join(',').localeCompare(b.tags.join(','));
        return 0;
      })
    );
  }

  function filterMatches() {
    matches.update(items =>
      items.filter(match => {
        const { minAge, maxAge, location, fameRating, tags } = filterCriteria;
        return (
          (minAge === null || match.age >= minAge) &&
          (maxAge === null || match.age <= maxAge) &&
          (location === '' || match.location.includes(location)) &&
          (fameRating === null || match.fameRating >= fameRating) &&
          (tags === '' || tags.split(',').every(tag => match.tags.includes(tag.trim())))
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
      <label class="block text-gray-700">Localisation
        <input
          type="text"
          bind:value={location}
          class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
          placeholder="Ville, région..."
          />
        </label>
    </div>
    <div>
      <label class="block text-gray-700">Tags d'intérêts
        <input
          type="text"
          bind:value={interests}
          class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
          placeholder="Exemple : sport, musique"
        />
      </label>
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
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Options de Tri et de Filtre</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-gray-700">Trier par
          <select
            bind:value={sortKey}
            on:change={sortMatches}
            class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
          >
            <option value="age">Âge</option>
            <option value="location">Localisation</option>
            <option value="fameRating">Popularité</option>
            <option value="tags">Tags</option>
          </select>
        </label>
      </div>
      <div>
        <label class="block text-gray-700">Filtrer par âge
          <div class="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              on:change={e => (filterCriteria.minAge = +e.target.value)}
              class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Max"
              on:change={e => (filterCriteria.maxAge = +e.target.value)}
              class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
        </label>
      </div>
      <div>
        <label class="block text-gray-700">Filtrer par localisation
          <input
            type="text"
            placeholder="Localisation"
            on:change={e => (filterCriteria.location = e.target.value)}
            class="mt-1 p-2 w-full border border-gray-300 rounded-lg"
          />
        </label>
      </div>
      <div>
        <label class="block text-gray-700">Filtrer par popularité
          <input
            type="number"
            on:change={e => (filterCriteria.fameRating = +e.target.value)}
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
            <th class="p-2 border border-gray-300">Localisation</th>
            <th class="p-2 border border-gray-300">Popularité</th>
            <th class="p-2 border border-gray-300">Tags</th>
          </tr>
        </thead>
        <tbody>
          {#each $matches as match}
            <tr>
              <td class="p-2 border border-gray-300">{match.age}</td>
              <td class="p-2 border border-gray-300">{match.location}</td>
              <td class="p-2 border border-gray-300">{match.fameRating}</td>
              <td class="p-2 border border-gray-300">{match.tags.join(', ')}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>