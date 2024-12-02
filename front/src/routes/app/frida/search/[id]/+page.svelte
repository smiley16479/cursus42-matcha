<script lang="ts">
import Profil from "$lib/elem/profil/profil.svelte";
import { page } from '$app/stores';
	import { onMount } from "svelte";
	import { visit } from "@/store/socketStore";
	import { us } from "@/store/userStore";

onMount(()=> {
  console.log(`$page`, $page.params);
  visit($us.user.id, parseInt($page.params.id));
})
</script>

<!-- Consultation d'un profil -->
<Profil userNum={parseInt($page.params.id)}/>