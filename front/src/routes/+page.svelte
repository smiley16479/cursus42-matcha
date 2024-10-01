<script>
	import Signin from '$lib/component/sign-in/signin.svelte';
	import '../app.css';
</script>

<svelte:head>
	<title>Matcha Frida</title>
	<meta name="Matcha Frida" content="Matcha Frida" />
</svelte:head>


<div class="app">
	<main>
		<section>
			<Signin/>
		</section>
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
