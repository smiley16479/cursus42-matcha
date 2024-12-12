<script>
	import Header from '$lib/elem/header/header.svelte';
	import NavigationTab from '@/lib/component/tabs/navigationTab.svelte';
	import '../../app.css';
	import { app } from '../../store/appStore';
	import { onMount } from 'svelte';
	import { us } from '@/store/userStore';
	import { goto } from '$app/navigation';
	import { beforeNavigate } from '$app/navigation';
	import Spinner from '@/lib/component/animation/spinner.svelte';
	import { logout } from '@/service/user';
	import { closeSocket } from '@/store/socketStore';
	import { LoggingState } from '@/type/user';
	import { markNotificationRead } from '../../store/socketStore';
	import { Notif_t_E } from '../../type/shared_type/notification';

	onMount(()=> {
		if (!$us.user.id) {
			alert("Vous avez été déconnecté");
			signOut();
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

	beforeNavigate((navigation) => {
		if (!navigation.to) {
				// La navigation est annulée ou interne (comme un scroll dans la page)
				console.log(`beforeNavigate(navigation)`);
				return;
		}

		// marquer les notifications LIKE, VISIT, MATCH comme lues dès l'arrivée sur la page matcha
		if (navigation.to.url.pathname == "/app/matcha") {
			for (const notif of $us.user.notifications) {
				if (notif.type == Notif_t_E.LIKE
					|| notif.type == Notif_t_E.VISIT
					|| notif.type == Notif_t_E.MATCH) {
						console.log(notif);
						markNotificationRead(notif.id);
					}
			}
		}

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
