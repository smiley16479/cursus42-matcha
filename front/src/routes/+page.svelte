<script>
	import Signin from '$lib/component/sign-in/signin.svelte';
	import Accueil from '$lib/section/accueil.svelte';
	import '../app.css';
	let loggedIn = false
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>


<div class="app">
  <main>
    <section>
      {#if !loggedIn}
  		<Signin bind:loggedIn/>
      {:else}
  		<Accueil/>
      {/if}
    </section>
  </main>
<!--   <footer>
    <p>Developped with love 💟 of Matcha's Team</p>
  </footer> -->
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		/* flex: 1; */
		display: flex;
		flex-direction: column;
		/* padding: 1rem; */
		width: 100%;
		/* max-width: 64rem; */
		margin: 0 auto;
		box-sizing: border-box;
	}
footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}
/* 	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	} */
</style>
