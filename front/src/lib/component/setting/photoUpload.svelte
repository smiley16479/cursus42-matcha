<script context="module">
	import { writable } from 'svelte/store';
  const photoUrls = writable([
    {
      filename: "https://via.placeholder.com/400x300",
	    pictureIndex: 1
    },
    {
      filename: "https://via.placeholder.com/400x300",
	    pictureIndex: 2
    },
    {
      filename: "https://via.placeholder.com/400x300",
	    pictureIndex: 3
    },
    {
      filename: "https://via.placeholder.com/400x300",
	    pictureIndex: 4
    },
  ]);
  let alreadyBeenMounted = false
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { picUpload } from '@/service/user';
	import { us } from '@/store/userStore';
  import type { UserPic_t } from '@/type/shared_type/user'
  // Initialisation d'un tableau pour stocker les photos (À CHANGER POULES VRAIS PHOTO)
  let photos: File[] = [];

  // Fonction pour gérer l'upload des photos
  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        photos.push(file);
        // Créer une URL pour prévisualiser l'image
        const url = URL.createObjectURL(file);
        $photoUrls.push({filename: url, pictureIndex: $photoUrls.length});
        $photoUrls = $photoUrls;

        // Préparer les données pour l'envoi au backend
        const formData = new FormData();
        formData.append('picture', file);
        formData.append('index', $photoUrls.length.toString()); 

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

  async function handleFileChange(event : any) {
    const fileInput = event.target;
    const image = fileInput.files[0];
    try {
/*       const resp = await userService.txAvatar(formData, $us.user.userName);
      console.log('handleFileChange', resp);
      if (resp.status === 201)
        console.log("Upload réussi", 'success'); */
    } catch (err) {
			// const error = err as AxiosError<any>;
        console.log(`err`, err);
    }
    let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e => {
        // avatar = e.target!.result
      };
  }

  // Fonction pour supprimer une photo
  function deletePhoto(index: number) {
    console.log(`delete photo index: ${index}`);
    photos.splice(index, 1);
    $photoUrls.splice(index, 1);
    $photoUrls = $photoUrls;
  }

  async function setFileAsUrl() {
    for (const [i, e] of $us.pictures.entries()) {
      if (!e.filename.includes('http://localhost'))
        e.filename = "http://localhost:3000/api/user/picture/" + e.filename
      $photoUrls.push(e);
      $photoUrls = $photoUrls;
    }
  }

  // Nettoyer les URL à la destruction du composant
  onMount(() => {
    // Générer les thumbnail
    if (!alreadyBeenMounted) {
      alreadyBeenMounted = true;
      setFileAsUrl();
    }
    return () => {
        $photoUrls.forEach((e) => URL.revokeObjectURL(e.filename));
    };
  });
</script>

<div class="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-4">Mes Photos</h2>

  <!-- Section d'upload des photos -->
  {#if $photoUrls.length < 5}
    <input type="file" accept="image/*" multiple on:change={handleFileUpload} class="mb-4 p-2 border rounded" />
  {/if}

  <div class="grid grid-cols-2 gap-4">
    {#each $photoUrls as elem, index}
      <div class="relative">
        <img src={elem.filename} alt="UploadedPic" class="w-32 h-32 object-cover rounded-md" />
        <button on:click={() => deletePhoto(index)} class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
          &times;
        </button>
      </div>
    {/each}
  </div>

  {#if $photoUrls.length === 0}
      <p class="mt-4 text-gray-500">Aucune photo uploadée.</p>
  {/if}
</div>