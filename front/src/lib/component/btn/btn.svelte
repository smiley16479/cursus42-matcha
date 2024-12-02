<script lang="ts">
  export let href = ""; // L'URL de destination
  export let disabled = false; // Désactiver le bouton
</script>

<a 
  href={href}
  class="inline-block px-4 py-2 bg-gray-200 text-gray-800 text-3xl font-semibold rounded-lg no-underline hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition border border-black"
  role="button" 
  aria-disabled={disabled ? 'true' : 'false'} 
  tabindex={disabled ? -1 : 0} 
  on:click={(e) => {
    if (disabled) {
      e.preventDefault(); // Empêche la redirection si le bouton est désactivé
    }
  }}
>
  <div class="flex justify-between items-center">
    <slot name="icon"></slot>
    <slot>Button</slot>
  </div>
</a>