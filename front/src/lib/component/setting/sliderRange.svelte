<script lang="ts">
  export let minAge: number;
  export let maxAge: number;

  function validateInterval() {
    if (minAge && maxAge && minAge > maxAge) 
      minAge = maxAge
  }
</script>

<div>
  <h2 class="block text-sm font-medium text-gray-700">Intervalle d'âge pour les matches</h2>

  <div class="flex flex-col gap-4">
    <div>
      <label for="minAge" class="block text-sm font-medium text-gray-600">Âge minimum</label>
      <input
        id="minAge"
        type="number"
        bind:value={minAge}
        min="18"
        max="98"
        placeholder="Ex : 18"
        class="p-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        on:change={validateInterval}
      />
    </div>
    <div>
      <label for="maxAge" class="block text-sm font-medium text-gray-600">Âge maximum</label>
      <input
        id="maxAge"
        type="number"
        bind:value={maxAge}
        min="18"
        max="99"
        placeholder="Ex : 25"
        class="p-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        on:change={validateInterval}
      />
    </div>
  </div>

  <!-- Affichage des valeurs actuelles -->
  {#if minAge !== undefined && maxAge !== undefined}
    <div class="mt-4 text-gray-600 text-sm">
      Intervalle : {minAge} - {maxAge}
    </div>
  {/if}
</div>
