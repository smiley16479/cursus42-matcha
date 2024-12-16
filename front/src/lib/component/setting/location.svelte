<script lang="ts">
	import { getUserLocation } from '@/service/user';
	import { us } from '@/store/userStore';
  import { onMount } from 'svelte';

  let error = '';

/*   navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        // L'utilisateur a déjà accordé la permission
        getLocation();
      } else if (result.state === 'prompt') {
        // La permission doit être demandée à l'utilisateur
        getLocation();
      } else {
        // La permission a été refusée
        console.log("L'utilisateur a refusé la géolocalisation.");
      }
    });

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          $us.user.latitude = position.coords.latitude;
          $us.user.longitude = position.coords.longitude;
        },
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              error = "Permission refusée par l'utilisateur.";
              break;
            case err.POSITION_UNAVAILABLE:
              error = "Informations de localisation indisponibles.";
              break;
            case err.TIMEOUT:
              error = "La requête a expiré.";
              break;
            default:
              error = "Une erreur inconnue s'est produite.";
          }
        }
      );
      console.warn(`OKOK`, $us.user.latitude, $us.user.longitude);
    } else {
      error = "La géolocalisation n'est pas supportée par ce navigateur.";
      console.warn(`error`, error);
    }
  } */

  function getLocation() {
  if (navigator.permissions) {
    console.log(`ask Permision`, );
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      console.log(`result`, result, navigator.geolocation);
      if (result.state === 'granted') {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      } else if (result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      } else {
        error = "L'utilisateur a refusé la géolocalisation.";
        // without permission
        getUserLocation().then((result) => {
          const loc: string = result.loc;
          console.log(`loc`, loc);
          $us.user.latitude = parseFloat(loc.split(',')[0]);
          $us.user.longitude = parseFloat(loc.split(',')[1]);
        });
      }
    });
  } else {
    console.log(`GetPOsition`);
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }
}

function successCallback(position : any) {
  console.log(`Permision Granted`, position);
  $us.user.latitude = position.coords.latitude;
  $us.user.longitude = position.coords.longitude;
}

function errorCallback(err : any) {
  error = "Erreur: Votre navigateur ou vos préférences de sécurités ne permettent pas la géolocalisation précise.\nNous vous géolocalisons par un autre moyen... Veuillez patienter";
  console.log(`error`, err.message);
  // without permission
  setTimeout( () => {
    getUserLocation().then((result) => {
      const loc: string = result.loc;
      $us.user.latitude = parseFloat(loc.split(',')[0]);
      $us.user.longitude = parseFloat(loc.split(',')[1]);
      console.log(`loc`, loc, parseFloat(loc.split(',')[0]));
      error = "";
    });
  }, 9000)
}

  onMount(async () => {
    getLocation();
  });
</script>

<div class="flex flex-col items-center justify-center p-4">
  <h1 class="text-2xl font-bold mb-4">Ma Position</h1>
  {#if error}
    <p class="text-red-500">{error}</p>
  {:else if $us.user.latitude && $us.user.longitude}
    <p class="text-lg">Latitude: {$us.user.latitude}</p>
    <p class="text-lg">Longitude: {$us.user.longitude}</p>
  {:else}
    <p>Demande de localisation en cours...</p>
  {/if}
</div>
<button
  on:click={getLocation}
  class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
>
  Obtenir ma Position
</button>