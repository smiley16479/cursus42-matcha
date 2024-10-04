<script lang="ts">
	import { us } from '@/store/userStore';
  import { onMount } from 'svelte';
  // import 'leaflet/dist/leaflet.css';
  // import L from 'leaflet';

  export const users = [
    // { name: 'User 1',   latitude: 48.8566, longitude: 2.3522 }, // Paris
    // { name: 'User 2',   latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
    // { name: 'User 3',   latitude: 51.5074, longitude: -0.1278 }, // Londres
    { name: 'Moi-Même', latitude: parseFloat($us.user.latitude.toFixed(3)), longitude: parseFloat($us.user.longitude.toFixed(3)) }
    
  ];

  // export let users = []; // Liste des utilisateurs avec latitude et longitude

  let L: any;
  let map: L.Map | null = null;
  let marker: L.Marker | null = null;
  let setLocMode = false;

  onMount(async () => {
    L = await import('leaflet');
    // Initialiser la carte
    map = L.map('map').setView([51.505, -0.09], 2); // Vue initiale

    // Ajouter une couche de tuile
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Ajouter des marqueurs pour chaque utilisateur
    users.forEach(user => {
      marker = L.marker([user.latitude, user.longitude])
        .addTo(map!)
        .bindPopup(`<b>${user.name}</b><br />${user.latitude}, ${user.longitude}`)
        .openPopup();
    });
  });

  function setLocation() {
    if (!map)
      return;
    if (setLocMode)
      return stopSetLocation();

    // Gérer les clics sur la carte
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Mettre à jour les variables de position de l'utilisateur
      $us.user.latitude = lat;
      $us.user.longitude = lng;

      // marker?.remove();
      // Ajouter un marqueur ou mettre à jour sa position si il existe déjà
      if (marker) {
        marker.setLatLng(e.latlng);
      }
      else {
        marker = L.marker([lat, lng]).addTo(map!)
        .bindPopup(`<b>${$us.user.userName}</b><br />${$us.user.latitude}, ${$us.user.longitude}`)
        .openPopup();
      }
    });
    setLocMode = true;
  }

  function stopSetLocation() {
    // Retirer l'événement de clic de la carte
    if (map)
      map.off('click');
    setLocMode = false;
  }
</script>

<style>
  #map {
    height: 500px; /* Hauteur de la carte */
    width: 100%; /* Largeur de la carte */
  }
</style>

<div id="map"></div>
<button
on:click={setLocation}
class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
>
  {(setLocMode ? "Valider" : "Changer") + " ma Position"}
</button>
{$us.user.latitude}
{$us.user.longitude}