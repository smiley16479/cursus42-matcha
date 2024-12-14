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
	import { space } from 'postcss/lib/list';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

  export let userNum = 0;
  let description=  writable<any[]>([]);
  let showBox = false;
  let showNopeBox = false;
  export let profil : IUserOutput;
  let isConnected;
  $: isConnected = $us.user.connectedUser.includes(profil?.id || +$page.params.id);

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
      .then(data => description.update(currentItems => {return [...currentItems, data]}))
      .catch(error => {
        console.error('Erreur lors du chargement du JSON:', error);
      });
    }
  }

  function computeDistance() {
    return haversine(profil!.latitude, profil!.longitude, $us.user.latitude, $us.user.longitude)
    .toFixed(0);
  }

function areUsersConnected(): string {
  if ($us.user.likedBy.some(e => e.likerUser.id === profil.id))
   return "green"
  else if ($us.user.chats.some(e => e.interlocutors.some(e => e.id === profil.id)))
    return "red"
  return ""
}

function isUserCOnnected() {
  return $us.user.connectedUser.includes(profil.id);
}

function formatDate() {
  return new Intl.DateTimeFormat('fr-FR', {
                  dateStyle: 'long',
                  // timeStyle: 'short',
                }).format(new Date(profil.lastConnection))
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
            <div class="flex items-center text-xl font-bold">
              {profil?.userName}, 
              {profil?.age}
              <span title={areUsersConnected() === "" ? "ne vous a pas liké" : "Vous a liké"}>
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" class={`pl-2 w-7 h-7`} fill={areUsersConnected()} viewBox="0 0 122.88 109.57" style="enable-background:new 0 0 122.88 109.57" xml:space="preserve">
                  <g>
                    <path d="M65.46,19.57c-0.68,0.72-1.36,1.45-2.2,2.32l-2.31,2.41l-2.4-2.33c-0.71-0.69-1.43-1.4-2.13-2.09 c-7.42-7.3-13.01-12.8-24.52-12.95c-0.45-0.01-0.93,0-1.43,0.02c-6.44,0.23-12.38,2.6-16.72,6.65c-4.28,4-7.01,9.67-7.1,16.57 c-0.01,0.43,0,0.88,0.02,1.37c0.69,19.27,19.13,36.08,34.42,50.01c2.95,2.69,5.78,5.27,8.49,7.88l11.26,10.85l14.15-14.04 c2.28-2.26,4.86-4.73,7.62-7.37c4.69-4.5,9.91-9.49,14.77-14.52c3.49-3.61,6.8-7.24,9.61-10.73c2.76-3.42,5.02-6.67,6.47-9.57 c2.38-4.76,3.13-9.52,2.62-13.97c-0.5-4.39-2.23-8.49-4.82-11.99c-2.63-3.55-6.13-6.49-10.14-8.5C96.5,7.29,91.21,6.2,85.8,6.82 C76.47,7.9,71.5,13.17,65.46,19.57L65.46,19.57z M60.77,14.85C67.67,7.54,73.4,1.55,85.04,0.22c6.72-0.77,13.3,0.57,19.03,3.45 c4.95,2.48,9.27,6.1,12.51,10.47c3.27,4.42,5.46,9.61,6.1,15.19c0.65,5.66-0.29,11.69-3.3,17.69c-1.7,3.39-4.22,7.03-7.23,10.76 c-2.95,3.66-6.39,7.44-10,11.17C97.2,74.08,91.94,79.12,87.2,83.66c-2.77,2.65-5.36,5.13-7.54,7.29L63.2,107.28l-2.31,2.29 l-2.34-2.25l-13.6-13.1c-2.49-2.39-5.37-5.02-8.36-7.75C20.38,71.68,0.81,53.85,0.02,31.77C0,31.23,0,30.67,0,30.09 c0.12-8.86,3.66-16.18,9.21-21.36c5.5-5.13,12.97-8.13,21.01-8.42c0.55-0.02,1.13-0.03,1.74-0.02C46,0.48,52.42,6.63,60.77,14.85 L60.77,14.85z"/>
                  </g>
                </svg>
              </span>
              {#if isConnected}
                <span class="pl-2 text-gray-500 text-sm align-bottom">online</span>
                <span class="relative ml-1 w-4 h-4 text-white text-xs flex items-center justify-center rounded-full bg-green-500"
                  aria-label="Notification Count"
                >
                </span>
              {:else}
                <span class="pl-2 text-gray-500 text-sm align-bottom">last connection {formatDate()}</span>
              {/if}
            </div>
            <div class="text-gray-500 text-sm">{computeDistance()} km <span>(fameRate: {profil.fameRate})</span></div>
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
