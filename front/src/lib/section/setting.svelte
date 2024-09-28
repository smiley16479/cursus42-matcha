<script lang="ts">
	import { writable } from "svelte/store";
	import { onMount } from "svelte";
	import { SexOrientation } from "../../type/user";
  import SliderRange from "../component/sliderRange.svelte";
	import PhotoUpload from "$lib/component/photoUpload.svelte";

	// Variables réactives pour les réglages de l'utilisateur
	let fullName = writable("");
	let email = writable("");
	let password = writable("");
	let bio = writable("");
	let profileVisibility = writable("Public");
	let sexOrientation: SexOrientation = SexOrientation.Straight;
	let emailNotifications = writable(false);
	let maxDistance = writable(50); // Distance en kilomètres
  
	// Chargement des données de l'utilisateur (simulées ici pour l'exemple)
	onMount(() => {
	  // Remplacez ces valeurs par des appels à une API ou à une base de données
	  fullName.set("John Doe");
	  email.set("john.doe@example.com");
	  bio.set("Passionné de voyages et de nouvelles rencontres.");
	  password.set(""); // Ne jamais pré-remplir le mot de passe en production
	  profileVisibility.set("Public");
	  emailNotifications.set(true);
	  maxDistance.set(50); // Par exemple, 50 km par défaut
	});
  
	// Fonction pour soumettre les modifications
	function saveChanges() {
	  // Logique de sauvegarde des données
	  // Par exemple, effectuer une requête API pour enregistrer les nouvelles valeurs
	  console.log("Modifications enregistrées:", {
		fullName,
		email,
		bio,
		profileVisibility,
		emailNotifications,
		maxDistance
	  });
	  alert("Modifications enregistrées avec succès !");
	}

		// Fonction pour suspendre le compte
	function suspendAccount() {
	  if (confirm("Êtes-vous sûr de vouloir suspendre votre compte ?")) {
			// Logique pour suspendre le compte utilisateur
			console.log("Compte suspendu");
			alert("Votre compte a été suspendu.");
	  }
	}

	// Fonction pour supprimer le compte
	function deleteAccount() {
	  if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
			// Logique pour supprimer le compte utilisateur
			console.log("Compte supprimé");
			alert("Votre compte a été supprimé.");
	  }
	}
  </script>
  
<!--   <style>
	.bg-custom { background-color: #f9fafb; }
	.slider::-webkit-slider-thumb {
	  appearance: none;
	  width: 16px;
	  height: 16px;
	  border-radius: 50%;
	  background: #4f46e5;
	  cursor: pointer;
	}
	.slider::-moz-range-thumb {
	  width: 16px;
	  height: 16px;
	  border-radius: 50%;
	  background: #4f46e5;
	  cursor: pointer;
	}
  </style>  -->
  
  <div class="h-full flex flex-col items-center justify-center py-12 px-6 lg:px-8 bg-custom">
	<div class="max-w-md w-full space-y-8">
	  <div class="text-center">
		<h2 class="mt-6 text-3xl font-extrabold text-gray-900">Réglages</h2>
		<p class="mt-2 text-sm text-gray-600">
		  Gérez vos préférences de compte et de confidentialité
		</p>
	  </div>
	  <form class="mt-8 space-y-6" on:submit|preventDefault={saveChanges}>
		<!-- Informations Personnelles -->
		<div class="rounded-md shadow-sm -space-y-px">
		  <div>
			<label for="full-name" class="sr-only">Nom complet</label>
			<input bind:value={$fullName} id="full-name" name="full-name" type="text" autocomplete="name" required
			  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
			  placeholder="Nom complet">
		  </div>
		  <div>
			<label for="email" class="sr-only">Adresse e-mail</label>
			<input bind:value={$email} id="email" name="email" type="email" autocomplete="email" required
			  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
			  placeholder="Adresse e-mail">
		  </div>
		  <div>
			<label for="password" class="sr-only">Mot de passe</label>
			<input bind:value={$password} id="password" name="password" type="password" autocomplete="new-password"
			  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
			  placeholder="Mot de passe">
		  </div>
		</div>
  
		<!-- Bio -->
		<div class="mt-6">
		  <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
		  <textarea bind:value={$bio} id="bio" name="bio" rows="3"
			class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
			placeholder="Parlez-nous de vous..."></textarea>
		</div>
  
		<!-- Paramètres de Confidentialité -->
		<div class="rounded-md shadow-sm -space-y-px">
		  <div class="mt-6">
			<label for="profile-visibility" class="block text-sm font-medium text-gray-700">Visibilité du profil</label>
			<select bind:value={$profileVisibility} id="profile-visibility" name="profile-visibility"
			  class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
			  <option>Public</option>
			  <option>Uniquement profils likés</option>
			</select>
			<label for="profile-sex-orientation" class="block text-sm font-medium text-gray-700">Orientation sexuelle</label>
			<select bind:value={sexOrientation} id="profile-sex-orientation" name="profile-sex-orientation"
			  class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
				<option>Straight</option>
				<option>Gay</option>
				<option>Bisexual</option>
				<option>Other</option>
			</select>
		  </div>
		  <div class="mt-6 flex items-center">
			<input bind:checked={$emailNotifications} id="email-notifications" name="email-notifications" type="checkbox"
			  class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
			<label for="email-notifications" class="ml-2 block text-sm text-gray-900">
			  Recevoir des notifications par e-mail
			</label>
		  </div>
		</div>
  
		<!-- Distance pour les matches -->
		<div class="mt-6">
		  <label for="max-distance" class="block text-sm font-medium text-gray-700">Distance maximale pour les matches</label>
		  <input type="range" id="max-distance" min="1" max="200" bind:value={$maxDistance}
			class="slider mt-1 block w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer">
		  <div class="flex justify-between text-sm text-gray-500">
				<span>1 km</span>
				<span>{$maxDistance} km</span>
				<span>200 km</span>
		  </div>
		</div>

		<SliderRange/>
		<PhotoUpload/>

		<!-- Bouton de Sauvegarde -->
		<div class="mt-6">
		  <button type="submit"
			class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
			Enregistrer les modifications
		  </button>
		</div>

		<!-- Gestion du Compte -->
		<div class="mt-6 space-y-6">
		  <div class="">
				<label for="suspend-account" class="block text-sm font-medium text-gray-700">Suppression du compte</label>
				<div class="mt-1">
					<button id="suspend-account" type="button"
					class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
					on:click={suspendAccount}>
					suspendre mon compte
					</button>
				</div>
			<label for="delete-account" class="block text-sm font-medium text-gray-700">Suppression du compte</label>
			<div class="mt-1">
			  <button id="delete-account" type="button"
				class="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
				on:click={deleteAccount}>
				Supprimer mon compte
			  </button>
			</div>
			<p class="mt-2 text-sm text-gray-600">
			  Cette action est irréversible.
			</p>
		  </div>
		</div>
	  </form>
	</div>
  </div>
  