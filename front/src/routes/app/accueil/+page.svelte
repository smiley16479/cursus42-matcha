<script lang="ts">
	import Accueil2 from "@/lib/elem/event/accueil2.svelte";
	import Event from "@/lib/elem/event/event.svelte";
	import Accueil from "@/lib/section/accueil.svelte";
	import { us } from "@/store/userStore";
	import { LoggingState } from "@/type/user";
</script>


{#if $us.user.emailVerified && $us.logState === LoggingState.logged}
	<Accueil2/>
	<Event/>
{:else}
	<Accueil/>
{/if}