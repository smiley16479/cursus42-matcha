<script lang="ts">
  import { onMount } from 'svelte';
  import { delAvatar, picUpload } from '@/service/user';
	import { us } from '@/store/userStore';

  /** Fonction pour gérer l'upload des photos */
  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        // Créer une URL pour prévisualiser l'image
        const url = URL.createObjectURL(file);
        let pictureIndex = 0;
        const idx = $us.user.pictures.map(e => e.pictureIndex);
        for (let i = 1; i < 6; i++)
          if (!idx.includes(i)) {
            pictureIndex = i;
            break;
          }
        if(!pictureIndex)
          throw Error("Index de la photo erroné");
        $us.user.pictures.push({filename: url, pictureIndex});
        $us.user.pictures = $us.user.pictures;

        // Préparer les données pour l'envoi au backend
        const formData = new FormData();
        formData.append('picture', file);
        formData.append('index', pictureIndex.toString()); 

        try {
          // Envoyer l'image au backend
          const response = await picUpload(formData);
          console.log('Image uploadée avec succès :', response.data);
        } catch (error) {
          console.error('Erreur lors de l\'upload de l\'image :', error);
        }
      }
      // Réinitialiser l'input pour permettre des uploads multiples
      input.value = '';
    }
  }

  // Fonction pour supprimer une photo
  async function deletePhoto(index: number, pictureIndex: number) {
    console.log(`delete photo index: ${index}`);
    try {
      await delAvatar(pictureIndex);
      $us.user.pictures.splice(index, 1);
      $us.user.pictures = $us.user.pictures;
    } catch (error) {
      alert('photo non effacée');
    }
  }

  /** Générer les thumbnail */
  function setFileAsUrl() {
    for (const [i, e] of $us.user.pictures.entries()) {
      if (!e.filename.includes('http://localhost'))
        e.filename = "http://localhost:3000/api/user/picture/" + e.filename
    }
  }

  /** Nettoyer les URL à la destruction du composant */
  onMount(() => {
    setFileAsUrl();
    return () => {
        $us.user.pictures.forEach((e) => URL.revokeObjectURL(e.filename));
    };
  });
</script>

<div class="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-4">Mes Photos</h2>

  <!-- Section d'upload des photos -->
  {#if $us.user.pictures.length < 5}
    <input type="file" accept="image/*" multiple on:change={handleFileUpload} class="mb-4 p-2 border rounded" />
  {/if}

  <div class="grid grid-cols-2 gap-4">
    {#each $us.user.pictures as elem, index}
      <div class="relative">
        <img src={elem.filename} alt="UploadedPic" class="w-32 h-32 object-cover rounded-md" />
        <button on:click={() => deletePhoto(index, elem.pictureIndex)} class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
          &times;
        </button>
      </div>
    {/each}
  </div>

  {#if $us.user.pictures.length === 0}
      <p class="mt-4 text-gray-500">Aucune photo uploadée.</p>
  {/if}
</div>