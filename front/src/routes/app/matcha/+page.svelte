<script lang="ts">

  import  CardSwiper  from '$lib/elem/swiper/CardSwiper.svelte'
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
  let description=  writable<string[]>([]);
  let data1: any
  onMount(()=> {
    for (let index = 0; index < 15; index++) {  
      fetch(`/profil/${index}/bio.json`)
      .then(response => response.json()) // Convertir la réponse en JSON
      .then(data => {
        // Manipuler les données JSON
        console.log(data.description);
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
          image: `/profil/${index}/1.webp`,
          title: 'Card ' + index,
          description: 'Description :' + $description?.[index]
          }
        }
</script>

{#if $description.length >2}
<section class="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8 bg">
  <div class="h-[80vh] w-[80vw]">
    <CardSwiper cardData={data1} />
  </div>
</section>
{/if}
