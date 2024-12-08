<script lang="ts">
	import Btn from "$lib/component/btn/btn.svelte";
	import { decodeHtmlEntities } from "@/service/util/sharedFunction";
	import { app } from "@/store/appStore";
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let element: HTMLElement;
	export let id: number = 0;
	export let color: string = '';
	export let title: string = '';
	export let description: string = '';
	export let userName: string = '';
	export let image: string | undefined = undefined;
</script>

<div
	class="w-full h-full absolute cursor-grab ease-in-out rounded-xl touch-none select-none border border-black bg-white {color}"
	bind:this={element}
>
	{#key image}
		{#if image}
				<img class="w-full h-full rounded-xl object-cover" src={image} alt={title} />
		{/if}
	{/key}
	<div class="absolute inset-0 bg-gradient-to-t from-white/80 via-white/0 rounded-b-xl"></div>
	<div class="p-2 absolute bottom-0 w-full flex justify-center">
		<div class="flex items-center flex-col gap-y-5">
			<!-- <Btn href={`/app/frida/${id}`}>Voir Profil</Btn> -->

			<button
				on:click={()=> {
					$app.profilConsult = true
					// dispatch('swiped', 'left');
					}}
				class="inline-block px-4 py-2 bg-gray-200 text-gray-800 text-3xl font-semibold rounded-lg no-underline hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition border border-black"
			>
				Voir Profil
			</button>
			<!-- <h3 class="text-3xl font-semibold pb-4">{title}</h3> -->
			<p>{userName}</p>
			<p>{decodeHtmlEntities(description)}</p>
		</div>
	</div>
</div>
