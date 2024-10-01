<script lang="ts">
  import  CardSwiper  from '$lib/elem/swiper/CardSwiper.svelte'
	import type { CardData, Direction } from '$lib/elem/swiper/';
  import type { SwipeEvent } from '@/type/event';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
  import Like from "$lib/component/animation/like.svelte";
	import Nope from "$lib/component/animation/nope.svelte";

	let showBox = false;
  let showNopeBox = false;

  let description=  writable<string[]>([]);
  let data1: any
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
      return [...currentItems, data.description];
    });
      })
      .catch(error => {
        console.error('Erreur lors du chargement du JSON:', error);
      });
    }
  })

  data1 =  (index: number) => {
        return {
          id: index,
          image: `/profil/${index}/1.webp`,
          title: 'Card ' + index,
          description: 'Description :' + $description?.[index]
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

{#if $description.length >2}
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