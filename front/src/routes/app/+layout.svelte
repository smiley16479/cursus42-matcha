<script>
	import Header from '$lib/elem/header/header.svelte';
	import NavigationTab from '@/lib/component/tabs/navigationTab.svelte';
	import '../../app.css';
	import { app } from '../../store/appStore';
	import { onMount } from 'svelte';
	import { us } from '@/store/userStore';
	import { goto } from '$app/navigation';
	import { initializeSocket } from '@/store/socketStore';

	onMount(()=> {
		if (!$us.user.id) {
			alert("Vous avez été déconnecté");
			goto("/");
		}
	})

	import { beforeNavigate } from '$app/navigation';
	import Spinner from '@/lib/component/animation/spinner.svelte';

	beforeNavigate((navigation) => {
		if (!navigation.to) {
				// La navigation est annulée ou interne (comme un scroll dans la page)
				console.log(`beforeNavigate(navigation)`);
				return;
		}
		initializeSocket();

		// Vérifier l'état de l'utilisateur à chaque navigation
		console.log('Navigation vers : ', navigation.to.url.pathname);
	});
</script>

<div class="app">
	<div class="header">
		<Header />
	</div>
	<main class="pb-6"> <!-- Mise de margin pour éviter le contenu rogné par le footer -->
		<slot />
	</main>
	<div class="w-full fixed bottom-0 backdrop-blur" class:hidden={!$app.footer}>
		<footer>
			<NavigationTab/>
		</footer>
	</div>
</div>

{#if $app.loadingSpinner}
  <Spinner size={32} imageUrl="/svg.svg" />
{/if}

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		/* padding: 1rem; */
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.header {
		position: sticky;
		top: 0;
		left: 0;
		width: 100%;
		transition: transform 0.3s ease-in-out;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
