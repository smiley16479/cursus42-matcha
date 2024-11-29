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
	import { ESexualPref, type IUserSelf } from '@/type/shared_type/user';

	let showBox = false;
  let showNopeBox = false;

  let description=  writable<string[]>([]);
  let browseItems=  writable<IUserSelf[]>([]);
  let data1: any
  onMount(()=> {
    getLocalProfil();
    get_db_Profil();
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
    // const pref = {...$us.user};
    // console.log(`pref`, pref);

  // modifié :         front/src/lib/elem/profil/profil.svelte
  // modifié :         front/src/lib/elem/swiper/CardSwiper.svelte
  // modifié :         front/src/routes/app/frida/+page.svelte

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
    minFameRate: $us.user.fameRate,
    maxFameRate: $us.user.fameRate + 100,
    nbRequiredProfiles:  20,
    offset:  0,
    sortingOn:  "score",
    sortingType:  "desc",
  }
  const user = $us.user;
  user.sexualPref = ESexualPref.Male;
  console.log(`{pref, user}`, {...pref, ...user});
  const profils = await browse({...pref, ...user});
  console.log(`profils:\n`, profils);
  if (profils)
    browseItems.set(profils);
}


  data1 =  (index: number) => {
        if (index< 20)
          return {
            id: $browseItems[index].id,
            image:  "http://localhost:3000/api/user/picture/" + $browseItems[index].pictures?.[0]?.filename,
            title: 'Card ' + index,
            description: 'Description :' + $browseItems[index].biography
        }

        return {
          id: index,
          image: `/profil/${index - 20}/1.webp`,
          title: 'Card ' + index,
          description: 'Description :' + $description?.[index - 20]
        }
      }


  function onSwipe(event : SwipeEvent) {
    // console.log('swiped', cardInfo.direction, 'on card', cardInfo.data.title);
    if (event.detail.direction === 'left')
      showNopeStamp()
    else
      showStamp()
    console.log(`event OnSwipe`, event);
  }

        // Fonction pour déclencher l'affichage et l'animation du "NOPE"
  function showNopeStamp() {
    console.log(`Nope`);
    showNopeBox = true;

    // Réinitialise l'animation après un certain temps si besoin
    setTimeout(() => {
      showNopeBox = false;
    }, 1000);  // Cache l'encart après 3 secondes
  }
// Fonction pour déclencher l'affichage et l'animation
function showStamp() {
  showBox = true;
  console.log(`Like`);

  // Réinitialise l'animation après un certain temps si besoin
  setTimeout(() => {
    showBox = false;
  }, 1000);  // Cache l'encart après 3 secondes
}
</script>

{#if $description.length >2 && $browseItems.length >2}
  <section class="flex min-h-full flex-col items-center justify-center px-6 lg:px-8 bg">
    <div class="h-[80vh] w-[80vw]">
      <CardSwiper on:swiped={onSwipe} cardData={data1} />
    </div>
  </section>
{/if}

<!-- SVG avec animation pour LIKE -->
{#if showBox}
	<Like/>
{/if}

<!-- SVG avec animation pour "NOPE" -->
{#if showNopeBox}
	<Nope/>
{/if}