<!-- <script lang="ts">
  import { Link } from 'svelte-routing';
  export let to = "";
  export let type: "button" | "reset" | "submit" | null | undefined = "button"; // Type du bouton
  export let disabled = false; // Désactiver le bouton
  export let onClick = () => {}; // Fonction à appeler lors du clic
</script>

<button 
  type={type} 
  class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
  on:click={onClick}
  disabled={disabled}
>
  <slot>Button</slot>
</button>

<Link 
to={to} 
class="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
>
<slot>Button</slot>
</Link> -->

<script lang="ts">
  export let href = ""; // L'URL de destination
  export let disabled = false; // Désactiver le bouton
</script>

<a 
  href={href}
  class="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded-lg no-underline hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
  role="button" 
  aria-disabled={disabled ? 'true' : 'false'} 
  tabindex={disabled ? -1 : 0} 
  on:click={(e) => {
    if (disabled) {
      e.preventDefault(); // Empêche la redirection si le bouton est désactivé
    }
  }}
>
  <slot>Button</slot> <!-- Contenu par défaut ou personnalisé du bouton -->
</a>