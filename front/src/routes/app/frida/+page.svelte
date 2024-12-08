<script lang="ts">
  import  CardSwiper  from '$lib/elem/swiper/CardSwiper.svelte'
  import type { SwipeEvent } from '@/type/event';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
  import Like from "$lib/component/animation/like.svelte";
	import Nope from "$lib/component/animation/nope.svelte";
	import { browse } from '@/service/browse';
	import { us } from '@/store/userStore';
	import { type IUserOutput } from '@/type/shared_type/user';
	import { app } from '@/store/appStore';
	import Match from '@/lib/component/animation/match.svelte';
	import { like } from '@/store/socketStore';
	import AdvancedSearch from '@/lib/elem/frida/advancedSearch.svelte';
	import Profil from '@/lib/elem/profil/profil.svelte';

  let showLikeBox = false;
  let showNopeBox = false;
  let showMatchBox = false;
  let swipingSearch = true;

  let offset = 0;

  let description = writable<string[]>([]);
  let browseItems = writable<IUserOutput[]>([]);
  let data1: any
  onMount(async ()=> {
    // getLocalProfil();
    $app.profilConsult = false;
    // $app.cardIndex = 0;
    offset = $app.cardIndex;
    if ($app.cardIndex >= $browseItems.length) {
      await get_db_Profil();
      $app.cardIndex = 0;
    }
  })

  function getLocalProfil() {
    for (let index = 0; index < 15; index++) {  
      fetch(`/profil/${index}/bio.json`)
      .then(response => response.json()) // Convertir la réponse en JSON
      .then(data => {
        description.update(currentItems => {
          return [...currentItems, data.description];
        });
      })
      .catch(error => {
        console.error('Erreur lors du chargement du JSON:', error);
      });
    }
  }

  async function get_db_Profil() {
  // const pref = {
  //   minFameRate: 0,
  //   maxFameRate: 100,
  //   nbRequiredProfiles : 50,
  //   offset:  0,
  //   sortingOn:  "score",
  //   sortingType:  "desc",
  // }

  const pref = {
    minFameRate: 0,
    maxFameRate: 100,
    matchAgeMin: 0,
    matchAgeMax: 99,
    maxDistance: 200000,
    nbRequiredProfiles : 50,
    offset: offset += 10,
    sortingOn:  "score",
    sortingType:  "desc",
    sexualPref: $us.user.sexualPref,
    latitude: $us.user.latitude,
    longitude: $us.user.longitude,
    interests: [],
  }
  const user = $us.user;
  console.log(`{pref, user}`, {...pref});
  try {
    $app.loadingSpinner = true;
    const profils = await browse({...pref});
    $app.loadingSpinner = false;
    console.log(`profils:\n`, profils);
    if (profils)
      browseItems.set(profils);
  } catch (error) {
    console.warn(`browse catch`, error);
    $app.loadingSpinner = false;
  }
}

  data1 =  (index: number) => {
    console.log(`Swiping`);
    // retourne les slides à CardSwiper
    return {
        id: $browseItems?.[index]?.id,
        image: $browseItems?.[index]?.pictures?.[0]?.filename ? "http://localhost:3000/api/user/picture/" + $browseItems?.[index]?.pictures?.[0]?.filename : undefined,
        title: 'Card ' + index,
        userName: $browseItems?.[index]?.userName,
        description: 'Description :' + $browseItems?.[index]?.biography
    }
  }

  function onSwipe(event : SwipeEvent) {
    console.log(`event OnSwipe`, event.detail.data);
    showStamp(event.detail.direction);
    if (event.detail.direction === "right")
      like(event.detail.data.id);
    resfreshProfils();
  }

// Fonction pour déclencher l'animation
function showStamp(direction: string) {
  const current_Viewed_UserId = $browseItems?.[$app.cardIndex]?.id;
  if (direction === "right") {
    if ($us.user.likedBy.some(e => e.likerUser.id === current_Viewed_UserId) ) {
      showMatchBox = true;
      setTimeout(() => (showMatchBox = false), 1000);
    } else {
      showLikeBox = true;
      setTimeout(() => (showLikeBox = false), 1000);
    }
  } else if (direction === "left") {
    showNopeBox = true;
    setTimeout(() => (showNopeBox = false), 1000);
  }
}

function resfreshProfils() {
  if ($app.cardIndex + 3 > $browseItems.length) {
    const pref = {
      minFameRate: 0,
      maxFameRate: 100,
      matchAgeMin: 0,
      matchAgeMax: 99,
      maxDistance: 200000,
      nbRequiredProfiles : 50,
      offset: offset += 10,
      sortingOn:  "score",
      sortingType:  "desc",
      sexualPref: $us.user.sexualPref,
      latitude: $us.user.latitude,
      longitude: $us.user.longitude,
      interests: [],
    }
    /* 
      "requiredGender": "Female",
      "minAge": 0,
      "maxAge": 99,
      "minFameRate": 0,
      "maxFameRate": 100,
      "locationLatitude": 48.865800402991646,
      "locationLongitude": 2.3514035501401054,
      "maxDistance": 200000,
      "interests": [
        "Walking",
        "Dancing"
      ],
      "nbRequiredProfiles": 20,
      "offset": 0,
      "sortingOn": "score",
      "sortingType": "desc"
     */
    browse({...pref}).then(data => {
      // console.log(`profils data FETCH:\n`, data);
      // console.log(`$browseItems data FETCH:\n`, $browseItems);
      if ((!data?.length || data?.length < pref.nbRequiredProfiles / 2) && offset > 0)
        offset = 0;
      if ($app.cardIndex >= $browseItems.length) {
        $app.cardIndex = 0;
        browseItems.set(data!);
      } else
        browseItems.update(currentItems => {
          return [...currentItems, ...data!];
        })
    }).catch(error => {
      console.error('Erreur lors du chargement du JSON:', error);
    });
  }
}
</script>

{$app.cardIndex}/{$browseItems.length} - {$browseItems?.[$app.cardIndex]?.userName}  <!-- data: {JSON.stringify(data1($app.cardIndex), null, 2)} -->
<section class="flex min-h-full flex-col items-center justify-center px-6 lg:px-8 bg">

  <div class="absolute top-8">
    <button
      on:click={()=> swipingSearch = !swipingSearch}
      class="inline-block px-4 py-2 bg-gray-200 text-gray-800 text-3xl font-semibold rounded-lg no-underline hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition border border-black"
    >
      <div class="flex justify-between items-center">
        <svg 
          version="1.1" id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 121.7 122.88"
          style="enable-background:new 0 0 121.7 122.88"
          xml:space="preserve"
          class="h-5 w-5"
        >
          <style type="text/css">
            .st0 { fill: #263036; }
            .st1 { fill-rule:evenodd; clip-rule:evenodd; fill: #90CAF8; }
          </style>
          <g>
            <path class="st0" d="M53.62,0c14.81,0,28.21,6,37.91,15.71c9.7,9.7,15.7,23.11,15.7,37.91c0,10.83-3.21,20.91-8.74,29.34 l23.2,25.29l-7.62,6.96l-8.38,7.66L83.32,98.26c-8.5,5.67-18.72,8.98-29.7,8.98c-14.81,0-28.21-6-37.91-15.71 C6,81.82,0,68.42,0,53.62C0,38.81,6,25.41,15.7,15.7C25.41,6,38.81,0,53.62,0L53.62,0L53.62,0z M87.3,19.93 C78.68,11.31,66.77,5.98,53.62,5.98c-13.15,0-25.06,5.33-33.68,13.95C11.31,28.55,5.98,40.46,5.98,53.62 c0,13.15,5.33,25.06,13.95,33.68c8.62,8.62,20.53,13.95,33.68,13.95c13.15,0,25.06-5.33,33.68-13.95 c8.62-8.62,13.95-20.53,13.95-33.68S95.92,28.55,87.3,19.93L87.3,19.93L87.3,19.93z"/>
            <path class="st1" d="M53.67,5.96c26.31,0,47.63,21.33,47.63,47.63c0,26.31-21.33,47.63-47.63,47.63S6.03,79.9,6.03,53.59 C6.03,27.28,27.36,5.96,53.67,5.96L53.67,5.96z M29.13,45.74c-0.99,2.1-3.49,3-5.59,2.01c-2.1-0.99-3-3.49-2.01-5.59 c1.53-3.22,3.36-6.25,5.5-9.08c2.13-2.81,4.59-5.45,7.39-7.92c1.73-1.53,4.39-1.37,5.92,0.36c1.53,1.73,1.37,4.39-0.36,5.92 c-2.33,2.06-4.41,4.3-6.23,6.7C31.94,40.53,30.4,43.06,29.13,45.74L29.13,45.74z"/>
          </g>
        </svg>
        &nbsp;{swipingSearch ? "Advanced" : "Swiping"} Search
      </div>
    </button>
  </div>

  {#if $browseItems.length <= $app.cardIndex && swipingSearch}
    <div class="flex h-[80vh] w-[80vw] items-center justify-center">
      <span class="text-gray-500 text-lg font-semibold">
        Il n'y a plus de Match à proximité
      </span>
    </div>
  {:else if $app.profilConsult}
    <Profil profil={$browseItems?.[$app.cardIndex]}/> <!--  userNum={parseInt($page.params.id)} -->
  {:else}
    <div class={`flex h-[80vh] w-[80vw] items-center justify-center ${$us.user.pictures.length ? "hidden": ""}`}>
      <span class="text-gray-500 text-lg font-semibold">
        Uploader au moins une image pour pouvoir liker
      </span>
    </div>
    <div class={`h-[80vh] w-[80vw] ${swipingSearch && $us.user.pictures.length ? "" :"hidden"}`}>
      {#key $app.cardIndex}
        <CardSwiper on:swiped={onSwipe} cardData={data1} />
      {/key}
    </div>
    <div class={`${swipingSearch || !$us.user.pictures.length ? "hidden": ""}`}>
      <AdvancedSearch bind:matches={browseItems}/>
    </div>
  {/if}
</section>

<!-- SVG avec animation pour LIKE -->
{#if showLikeBox}
	<Like/>
{/if}

<!-- SVG avec animation pour "NOPE" -->
{#if showNopeBox}
	<Nope/>
{/if}

<!-- Animation pour "MATCH" -->
{#if showMatchBox}
	<Match/>
{/if}