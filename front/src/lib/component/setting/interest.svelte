<script lang="ts">
  import { writable } from 'svelte/store';
  import { EInterest } from '@/type/shared_type/user';
	import { us } from '@/store/userStore';

  const selectedOptions = writable<string[]>([]);
  const options = Object.keys(EInterest).filter(key => isNaN(Number(key)))
  .map(key => ({ id: key, label: EInterest[key as keyof typeof EInterest] }));
  let isOpen = false; // État pour ouvrir/fermer le menu

  const toggleOption = (newInterest: string) => {
      selectedOptions.update(current => {
          if (current.includes(newInterest)) {
              return current.filter(option => option !== newInterest); // Désélectionner
          } else {
              return [...current, newInterest]; // Sélectionner
          }
      });
  };

  const toggleDropdown = () => {
      isOpen = !isOpen; // Ouvrir ou fermer le menu
  };

  let choices: string[] = [];
  selectedOptions.subscribe(value => {
      choices = value; // Mettez à jour les choix lorsque le store change
      $us.user.interests = value;
  });
</script>

<div>
  <button class="flex items-center cursor-pointer" type="button" on:click={toggleDropdown} aria-expanded={isOpen}>
    Mes centres d'intérêts :
    <span class="ml-2">{isOpen ? '▲' : '▼'}</span>
  </button>

  <div class="flex flex-wrap mt-2">
      {#if choices.length > 0}
        {#each choices as choice}
          <span class="bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 mr-2 mb-2">
            {choice}
          </span>
        {/each}
      {:else}
        <span class="text-gray-500">Aucune option sélectionnée.</span>
      {/if}
  </div>
  {#if isOpen}
    <div class="border border-gray-300 rounded-lg mt-2 bg-white shadow-lg p-3">
      <div class="grid grid-cols-3 gap-2">
        {#each options as option}
          <label class="flex items-center mb-2">
            <input type="checkbox" 
              on:change={() => toggleOption(option.id)} 
              checked={choices.includes(option.id)} 
              class="mr-2" />
            {option.label}
          </label>
        {/each}
      </div>
    </div>
  {/if}
</div>