<script lang="ts">
	import { fade } from "svelte/transition";
	import Btn from "$lib/component/btn/btn.svelte";
	import LikeNopeBtn from "$lib/component/btn/like_nopeBtn.svelte";
	import Like from "$lib/component/animation/like.svelte";
	import Nope from "$lib/component/animation/nope.svelte";
	export let element: HTMLElement;

	export let id: number = 0;
	export let color: string = '';
	export let title: string = '';
	export let description: string = '';
	export let image: string | undefined = undefined;

	let showBox = false;
  let showNopeBox = false;
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
	<div class="p-4 absolute bottom-0 w-full flex justify-center">
		<div class="flex items-center flex-col">
			<Btn href={`/app/matcha/${id}`}>Voir Profil {id}</Btn>
			<LikeNopeBtn  bind:showBox bind:showNopeBox ></LikeNopeBtn>
			<h3 class="text-3xl font-semibold pb-4">{title}</h3>
			<p>{description}</p>
		</div>
	</div>
</div>
<!-- SVG avec animation pour LIKE -->
{#if showBox}
<div class="z-10">
	<Like/>
</div>
{/if}

<!-- SVG avec animation pour "NOPE" -->
{#if showNopeBox}
<div class="z-10">
	<Nope/>
</div>
{/if}
