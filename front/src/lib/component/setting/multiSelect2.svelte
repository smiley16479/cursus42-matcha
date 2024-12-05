<script lang="ts">
	import { EInterest } from '@/type/shared_type/user';
  import { writable } from 'svelte/store';
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let options: string[] = Object.keys(EInterest).filter(key => isNaN(Number(key)))
  export let selected: string[];
  const selectedOptions = writable<string[]>([]);
  let isOpen = false;

  // Gestion de la sélection ou désélection d'une option
  function toggleOption(option: string) {
    selectedOptions.update((current) => {
      if (current.includes(option)) // remove
        selected = current.filter((item) => item !== option);
      else // ajout
        selected = [...current, option];
      dispatch("change", selected);
      return selected;
    });
  }
</script>

<div class="relative" on:click={()=> (isOpen = !isOpen)} on:keydown={()=> (isOpen = !isOpen)} role="button" tabindex="0">
  <label class="block text-gray-700 mb-2">
    <slot>
      Tags d'intérêts
    </slot>
    <!-- Zone de sélection -->
    <div
      class="mt-1 p-1 w-full border border-gray-300 rounded-lg flex flex-wrap items-center gap-2"
      role="textbox"
    >
      {#each $selectedOptions as selected}
        <span
          class="bg-blue-500 text-white px-2 py-1 rounded-full flex items-center space-x-2"
        >
          {selected}
          <button
            class="ml-1 text-white hover:text-red-400"
            on:click={(e) => {
              e.stopPropagation();
              toggleOption(selected);
            }}
          >
            &times;
          </button>
        </span>
      {/each}
      <input
        type="text"
        placeholder="Cliquez pour sélectionner"
        class="flex-1 p-1 outline-none cursor-pointer"
        readonly
      />
    </div>
  </label>

  <!-- Menu déroulant -->
  {#if isOpen}
    <div
      class="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50"
      on:click|stopPropagation
      on:keydown|stopPropagation
      role="button" tabindex="0"
    >
      {#each options as option, index (option)}
        {#if !$selectedOptions.includes(option)}
          <div
            class="p-2 hover:bg-gray-200 cursor-pointer"
            on:click={() => toggleOption(option)}
            on:keydown={() => toggleOption(option)}
            role="button" tabindex="{index}"
          >
            {option}
          </div>
        {/if}
      {/each}
    </div>
    {/if}
</div>

<!-- Click away handler -->
<div class="fixed inset-0" on:click={()=> (isOpen = false)} on:keydown={()=> (isOpen = false)} hidden={!isOpen} role="button" tabindex="0"></div>