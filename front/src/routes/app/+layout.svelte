<script>
	import Header from '$lib/elem/header/header.svelte';
	import Tab from '$lib/component/tabs/tab.svelte';
	import '../../app.css';
	import { app } from '../../store/appStore';
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
			<Tab/>
		</footer>
	</div>
</div>

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
		z-index: 1;
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
