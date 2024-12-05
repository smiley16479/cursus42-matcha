<script lang="ts">
  import  CardSwiper  from '$lib/elem/swiper/CardSwiper.svelte'
	import type { CardData, Direction } from '$lib/elem/swiper/';
  import type { SwipeEvent } from '@/type/event';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
  import Like from "$lib/component/animation/like.svelte";
	import Nope from "$lib/component/animation/nope.svelte";
	import { browse } from '@/service/browse';
	import { us } from '@/store/userStore';
	import { ESexualPref, type IUserOutput } from '@/type/shared_type/user';
	import { app } from '@/store/appStore';
	import Match from '@/lib/component/animation/match.svelte';
	import { like } from '@/store/socketStore';

	let showBox = false;
  let showNopeBox = false;
  let showMatchBox = false;
  let matchArrayID = [1,2,3,4,5,6,7,8,9]

  let description=  writable<string[]>([]);
  let browseItems=  writable<IUserOutput[]>([]);
  let data1: any
  onMount(async ()=> {
    // getLocalProfil();
    await get_db_Profil();
    // if ($app.cardIndex >= $browseItems.length)
      // $app.cardIndex = 0;
  })

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
          return [...currentItems, data.description];
        });
      })
      .catch(error => {
        console.error('Erreur lors du chargement du JSON:', error);
      });
    }
  }

  async function get_db_Profil() {
// what I have
/* let user ={
  age: 0 ,
  biography: "" ,
  email: "" ,
  emailNotifications: false ,
  emailVerified: false ,
  fameRate: 0 ,
  firstName: "" ,
  gender: "Unknown" ,
  interests: [] ,
  lastConnection: new Date(),
  lastName: "" ,
  latitude: 48.8534 ,
  longitude: 2.3488 ,
  matchAgeMax: 100 ,
  matchAgeMin: 18 ,
  maxDistance: 0 ,
  password: "" ,
  prefGeoloc: "Never" ,
  profileVisibility: true ,
  sexualPref: "Both" ,
  userName: "",
}

// NEEDED
let obj = {
  sexualPref: "Female",
  matchAgeMin: 0,
  matchAgeMax: 99,
  minFameRate: 0,
  maxFameRate: 100,
  latitude: 48.865800402991646,
  longitude: 2.3514035501401054,
  maxDistance: 200000,
  interests: [
      "Walking",
      "Dancing"
  ],
  nbRequiredProfiles: 20,
  offset: 0,
  sortingOn: "score",
  sortingType: "desc"
}
 */
const { 
    sexualPref, 
    matchAgeMin,
    matchAgeMax,
    latitude,
    longitude,
    maxDistance,
    interests  
} = $us.user
  const pref = {
    minFameRate: 0,
    maxFameRate: 100,
    nbRequiredProfiles:  20,
    offset:  0,
    sortingOn:  "score",
    sortingType:  "desc",
  }
  const user = $us.user;
  console.log(`{pref, user}`, {...pref, ...user});
  try {
    $app.loadingSpinner = true;
    const profils = await browse({...pref, ...user});
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
  const current_Viewed_UserId = $browseItems?.[$app.cardIndex-2]?.id;
  if (direction === "right") {
    if (matchArrayID.includes(current_Viewed_UserId) ) {
      showMatchBox = true;
      setTimeout(() => (showMatchBox = false), 1000);
    } else {
      showBox = true;
      setTimeout(() => (showBox = false), 1000);
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
      nbRequiredProfiles:  50,
      offset:  0,
      sortingOn:  "score",
      sortingType:  "desc",
    }
    browse({...pref, ...$us.user}).then(data => {
      // console.log(`profils data FETCH:\n`, data);
      // console.log(`$browseItems data FETCH:\n`, $browseItems);
      if ((!data?.length || data?.length < 20) && $app.offset > 0)
        $app.offset -= 20;
      if ($app.cardIndex > 20) {
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

<!-- {$app.cardIndex}/{$browseItems.length} - {$browseItems?.[$app.cardIndex]?.userName}  data: {JSON.stringify(data1($app.cardIndex), null, 2)} -->
<section class="flex min-h-full flex-col items-center justify-center px-6 lg:px-8 bg">
  {#if !$us.user.pictures.length}
    <div class="flex h-[80vh] w-[80vw] items-center justify-center">
      <span class="text-gray-500 text-lg font-semibold">
        Uploader au moins une image pour pouvoir liker
      </span>
    </div>
  {:else if $browseItems.length > $app.cardIndex}
    <div class="h-[80vh] w-[80vw]">
      <CardSwiper on:swiped={onSwipe} cardData={data1} />
    </div>
  {:else}
    <div class="flex h-[80vh] w-[80vw] items-center justify-center">
      <span class="text-gray-500 text-lg font-semibold">
        Il n'y a plus de Match à proximité
      </span>
    </div>
  {/if}
</section>

<!-- SVG avec animation pour LIKE -->
{#if showBox}
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