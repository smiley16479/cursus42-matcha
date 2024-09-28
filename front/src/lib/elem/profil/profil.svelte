<script lang="ts">
	import Like from '$lib/component/animation/like.svelte';
	import Nope from '$lib/component/animation/nope.svelte';
  import LikeNopeBtn from '$lib/component/btn/like_nopeBtn.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
  let description=  writable<any[]>([]);
  onMount(()=> {
    for (let index = 0; index < 15; index++) {  
      fetch(`/profil/${index}/bio.json`)
      .then(response => response.json()) // Convertir la réponse en JSON
      .then(data => {
        // Manipuler les données JSON
        // console.log(data.description);
        // description.push(data.description);
        description.update(currentItems => {
      // Créer une nouvelle copie du tableau avec l'élément ajouté
      return [...currentItems, data];
    });
      })
      .catch(error => {
        console.error('Erreur lors du chargement du JSON:', error);
      });
    }
  })

  export let userNum = 0;
  export let user = {
    name: 'John Doe',
    age: 30,
    bio: 'Aime les aventures en plein air et les voyages.',
    interests: ['Voyage', 'Lecture', 'Musique', 'Sports'],
    distance: 5,
    photos: [
      'https://via.placeholder.com/300x400.png?text=Photo+1',
      'https://via.placeholder.com/300x400.png?text=Photo+2',
      'https://via.placeholder.com/300x400.png?text=Photo+3'
    ]
  };

  let showBox = false;
  let showNopeBox = false;
</script>

{userNum}
<div class="w-screen bg-white ">
  <button on:click={()=>  window.history.back()}
    class="h-20 w-20 fixed left-4">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" stroke="1px" x="0px" y="0px" viewBox="0 0 122.883 122.882" enable-background="new 0 0 122.883 122.882" xml:space="preserve"><g><path d="M61.441,0c16.967,0,32.327,6.877,43.446,17.996c11.119,11.119,17.996,26.479,17.996,43.445 c0,16.966-6.877,32.326-17.996,43.445c-11.119,11.118-26.479,17.995-43.446,17.995c-16.966,0-32.326-6.877-43.445-17.995 C6.877,93.768,0,78.407,0,61.441c0-16.967,6.877-32.327,17.996-43.445C29.115,6.877,44.475,0,61.441,0L61.441,0z M71.377,42.166 c1.736-1.784,1.695-4.637-0.088-6.372s-4.637-1.696-6.373,0.088L43.078,58.402l3.23,3.142l-3.244-3.146 c-1.737,1.792-1.693,4.652,0.099,6.39c0.052,0.05,0.104,0.099,0.158,0.146l21.595,22.082c1.736,1.784,4.59,1.823,6.373,0.088 c1.783-1.734,1.824-4.588,0.088-6.372L52.598,61.531L71.377,42.166L71.377,42.166z M98.496,24.386 C89.014,14.903,75.912,9.038,61.441,9.038s-27.572,5.865-37.055,15.348C14.903,33.869,9.038,46.97,9.038,61.441 c0,14.471,5.865,27.572,15.349,37.055c9.482,9.483,22.583,15.349,37.055,15.349s27.573-5.865,37.055-15.349 c9.484-9.482,15.35-22.584,15.35-37.055C113.846,46.97,107.98,33.869,98.496,24.386L98.496,24.386z"/></g></svg>
  </button>
</div>
{#if $description.length}
  <!-- Utilisation des classes Tailwind pour styliser le composant -->
  <div class="flex flex-col p-4 border border-gray-300 rounded-lg bg-white w-full mx-auto"> <!-- max-w-lg -->
    <!-- En-tête avec nom et distance -->
    <div class="flex justify-between items-center sticky top-0 bg-white p-2">
      <div class="text-xl font-bold">{$description?.[userNum]?.nom}, {$description?.[userNum]?.age}</div>
      {$description?.[userNum]?.photo}
      <div class="text-gray-500 text-sm">{user.distance} km</div>

    <!-- Bio -->
    <div class="mt-4 text-base">{user.bio}</div>

    <!-- Intérêts -->
    <div class="mt-4 flex flex-wrap gap-2">
      {#each user.interests as interest}
        <div class="bg-gray-300 px-3 py-1 rounded-full text-sm">{interest}</div>
      {/each}
    </div>
  </div>

    <!-- Galerie de photos avec défilement vertical -->
    <div class="h-[90%] mt-4 flex flex-col gap-4 overflow-y-auto"> <!-- max-h-80 -->
<!--       {#each user.photos as photo}
        <img src={photo} alt="User" class="w-full rounded-lg" />
      {/each}
       -->
      {#each Array.from({ length: $description?.[userNum]?.photo }, (_, i) => i + 1) as item}
      <img src={`/profil/${userNum}/${item}.webp`} alt="User" class="w-full rounded-lg" />
      {/each}
    </div>
  </div>
{/if}
<div class="fixed bottom-20 left-0 right-0 ">
  <LikeNopeBtn bind:showBox bind:showNopeBox profil={true}></LikeNopeBtn>
</div>

<!-- SVG avec animation pour LIKE -->
{#if showBox}
  <Like/>
{/if}

<!-- SVG avec animation pour "NOPE" -->
{#if showNopeBox}
  <Nope/>
{/if}
