<script lang="ts">
	import Btn from "$lib/component/btn/btn.svelte";
	import { decodeHtmlEntities } from "@/service/util/sharedFunction";

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
			<Btn href={`/app/frida/search/${id}`}>Voir Profil</Btn>
			<!-- <h3 class="text-3xl font-semibold pb-4">{title}</h3> -->
			<p>{userName}</p>
			<p>{decodeHtmlEntities(description)}</p>
		</div>
	</div>
</div>
