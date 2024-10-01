<script lang="ts">
import Profil from "$lib/elem/profil/profil.svelte";
import { page } from '$app/stores';
	import { onMount } from "svelte";

onMount(()=> {
  console.log(`$page`, $page.params); 
})
</script>

<!-- Consultation d'un profil -->
<Profil userNum={parseInt($page.params.id)}/>