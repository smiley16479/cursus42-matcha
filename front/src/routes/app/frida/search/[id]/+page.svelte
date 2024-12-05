<script lang="ts">
import Profil from "$lib/elem/profil/profil.svelte";
import { page } from '$app/stores';
import { onMount } from "svelte";
import { visit } from "@/store/socketStore";

onMount(()=> {
  if ($page.params.id)
    visit(parseInt($page.params.id));
  console.warn(`User id undefined`);
})
</script>

<!-- Consultation d'un profil -->
<Profil userNum={parseInt($page.params.id)}/>