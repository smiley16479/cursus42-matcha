<script>
	import Header from '$lib/elem/header/header.svelte';
	import NavigationTab from '@/lib/component/tabs/navigationTab.svelte';
	import '../../app.css';
	import { app } from '../../store/appStore';
	import { onMount } from 'svelte';
	import { refreshNotif, us } from '@/store/userStore';
	import { goto } from '$app/navigation';
	import { beforeNavigate } from '$app/navigation';
	import Spinner from '@/lib/component/animation/spinner.svelte';
	import { logout } from '@/service/user';
	import { closeSocket } from '@/store/socketStore';
	import { LoggingState } from '@/type/user';

	onMount(async ()=> {
		if (!$us.user.id) {
			await signOut();
			alert("Vous avez été déconnecté");
		}
	})

	async function signOut() {
    try {
      await logout();
      closeSocket();
      $us.logState = LoggingState.unlogged;
      $app.tabIdx = 0;
      goto('/')
    } catch (error) {
      console.warn(`error`, error);
      throw error;
    }
  }

  function isProfilCompleted() {
    const u = $us.user;
    if (u.pictures.length && u.interests.length && u.biography)
      return true;

		if ($us.logState === LoggingState.logged)
    	alert("Vous devez renseigner au moins votre bio un intéret et mettre une photo pour utiliser l'application");
    goto("/app/profil");
    return false;
  }

	beforeNavigate((navigation) => {
		if (!navigation.to) {
				// La navigation est annulée ou interne (comme un scroll dans la page)
				console.log(`beforeNavigate(navigation)`);
				return;
		}

		const tab = ["/accueil", "/matcha", "/frida", "/profil"]
		const pathname = navigation.to.url.pathname;
		const index = tab.findIndex(item => pathname.includes(item));
		$app.tabIdx = index;

		// Vérifier l'état de l'utilisateur à chaque navigation
		if (navigation.to.url.pathname !== "/app/profil") {
			isProfilCompleted();
			refreshNotif();
		}
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
	<div class="w-full fixed bottom-0 backdrop-blur" class:hidden={!$us.user.emailVerified}> <!-- class:hidden={!$app.footer} -->
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
