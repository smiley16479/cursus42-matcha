<script lang="ts">
	import { page } from '$app/stores';
	import Like from '$lib/component/animation/like.svelte';
	import Nope from '$lib/component/animation/nope.svelte';
  import LikeNopeBtn from '$lib/component/btn/like_nopeBtn.svelte';
	import { getUser } from '@/service/user';
	import { decodeHtmlEntities, haversine } from '@/service/util/sharedFunction';
	import { app } from '@/store/appStore';
	import { visit } from '@/store/socketStore';
	import { us } from '@/store/userStore';
	import type { IUserOutput } from '@/type/shared_type/user';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

  export let userNum = 0;
  let description=  writable<any[]>([]);
  let showBox = false;
  let showNopeBox = false;
  export let profil : IUserOutput;

  onMount(()=> {
    // getLocalProfil();
    console.log(`$page.params.id`, $page.params.id);
    if (userNum)
      getProfil(userNum);
    else if (profil?.id)
      visit(profil.id);
  })

  async function getProfil(id: number) {
    try {
      profil = await getUser(id);
    } catch (error) {
      console.error(`recup Profil failed`, error);
    }
  }

  function getLocalProfil() {
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
  }

  function computeDistance() {
    return haversine(profil!.latitude, profil!.longitude, $us.user.latitude, $us.user.longitude)
    .toFixed(0);
  }

</script>

{#if profil}

  <!-- Utilisation des classes Tailwind pour styliser le composant -->
  <div class="flex flex-col p-4 border border-gray-300 rounded-lg bg-white w-full mx-auto"> <!-- max-w-lg -->
    <!-- En-tête avec nom et distance -->
    <div class="justify-between items-center bg-white p-2"> <!-- sticky top-0 -->

      <div class="flex flex-col rounded-lg bg-white w-full">
        <div class="flex justify-between items-center bg-white">
          <div class="flex flex-col text-left">
            <div class="text-xl font-bold">{profil?.userName}, {profil?.age}</div>
            <div class="text-gray-500 text-sm">{computeDistance()} km</div>
          </div>
          <button 
            class="bg-blue-500 text-white text-sm px-4 py-2 rounded-md h-auto flex items-center justify-center"
            style="height: auto;">
            Unmatch
          </button>
        </div>
      </div>

      <!-- Bio -->
      <div class="mt-4 text-base">{decodeHtmlEntities(profil.biography)}</div>

      <!-- Intérêts -->
      <div class="mt-4 flex flex-wrap gap-2">
        {#each profil.interests as interest}
          <div class="bg-gray-300 px-3 py-1 rounded-full text-sm">{interest}</div>
        {/each}
      </div>
    </div>

    <!-- Galerie de photos avec défilement vertical -->
    <div class="h-[90%] mt-4 mb-9 flex flex-col gap-4 overflow-y-auto"> <!-- max-h-80 -->
<!--       {#each user.photos as photo}
        <img src={photo} alt="User" class="w-full rounded-lg" />
      {/each}
       -->
      {#each profil?.pictures as item}
        <img src={`http://localhost:3000/api/user/picture/${item.filename}`} alt="User" class="w-full rounded-lg" />
      {/each}
    </div>
  </div>
{/if}

<!-- Si != tab Matcha on peut liker -->
{#if $app.tabIdx !== 1}
  <div class="fixed bottom-20 left-0 right-0">
    <LikeNopeBtn bind:showBox bind:showNopeBox {profil}></LikeNopeBtn>
  </div>
{/if}

<!-- SVG avec animation pour LIKE -->
{#if showBox}
  <Like/>
{/if}

<!-- SVG avec animation pour "NOPE" -->
{#if showNopeBox}
  <Nope/>
{/if}
