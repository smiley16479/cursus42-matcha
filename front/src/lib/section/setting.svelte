<script lang="ts">
	import { LoggingState } from "../../type/user";
  import SliderRange from "../component/setting/sliderRange.svelte";
	import PhotoUpload from "@/lib/component/setting/photoUpload.svelte";
	import Location from "../component/setting/location.svelte";
	import MapLocation from "../component/map/mapLocation.svelte";
	import Interest from "../component/setting/interest.svelte";
	import { ESexualPref, EGender, EGeoPref } from "@/type/shared_type/user";
	import { us } from "@/store/userStore";
	import { deleteUser, getCurrentUser, logout, updateUser } from "@/service/user";
	import { goto } from "$app/navigation";
	import { app } from "@/store/appStore";
	import { closeSocket } from "@/store/socketStore";

	/** Fonction pour soumettre les modifications du userAccount */
	async function saveChanges() {
		try {
			await updateUser($us.user);
			alert("Modifications enregistrées avec succès !");
		} catch (error) {
			alert(error);
			console.log(`error`, error);
		}
	}

	async function disconnect() {
		try {
			await logout();
      closeSocket();
			$us.logState = LoggingState.unlogged;
			$app.tabIdx = 0;
			goto('/')
		} catch (error) {
			console.log(`error`, error);
		}
	}

	async function suspendAccount() {
	  if (confirm("Êtes-vous sûr de vouloir suspendre votre compte ?")) {
			// Logique pour suspendre le compte utilisateur
			// TEST RIEN À VOIR
			const resp = await getCurrentUser()
			console.log("Compte suspendu", resp);

			alert("Votre compte a été suspendu.");
	  }
	}

	async function deleteAccount() {
	  if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
			// Logique pour supprimer le compte utilisateur
			try {
				await deleteUser();
				disconnect();
				console.log("Compte supprimé");
				alert("Votre compte a été supprimé.");
			} catch (error) {
				console.log('Erreur lors de la suppression du compte');
				alert("Erreur lors de la suppression du compte");
			}
	  }
	}
  </script>

	<pre>{JSON.stringify($us, null, 2)}</pre>

<div class="h-full flex flex-col items-center justify-center pb-12 px-6 lg:px-8 bg-custom">
	<div class="max-w-md w-full space-y-8">
	  <div class="text-center">
			<h2 class="mt-6 text-3xl font-extrabold text-gray-900">Réglages</h2>
			<p class="mt-2 text-sm text-gray-600">
			  Gérez vos préférences de compte et de confidentialité
			</p>
	  </div>
		<PhotoUpload/>
		<Location/>
		<MapLocation/>
	  <form class="mt-8 space-y-6" on:submit|preventDefault={saveChanges} autocomplete="off">
		<!-- Informations Personnelles -->
		<div class="rounded-md shadow-sm -space-y-px">
			<h1 class="text-2xl font-bold mb-4">Mes Informations</h1>
			<div>
				<label for="famerate" class="sr-only">fameRate</label>
				<input value={"fameRate " + $us.user.fameRate} id="famerate" name="famerate" type="text" autocomplete="name" disabled
					class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
					placeholder="Votre Famerate n'est pas encore déterminé">
			</div>
			<div>
				<label for="first-name" class="sr-only">Prénom</label>
				<input bind:value={$us.user.firstName} id="first-name" name="first-name" type="text" autocomplete="name" required
					class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
					placeholder="Nom complet">
			</div>
			<div>
				<label for="last-name" class="sr-only">Nom</label>
				<input bind:value={$us.user.lastName} id="last-name" name="last-name" type="text" autocomplete="name" required
					class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
					placeholder="Nom complet">
			</div>
			<div>
				<label for="email" class="sr-only">Adresse e-mail</label>
				<input bind:value={$us.user.email} id="email" name="email" type="email" autocomplete="email" required
					class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
					placeholder="Adresse e-mail">
			</div>
			<!-- <div>
				<label for="password" class="sr-only">Mot de passe</label>
				<input bind:value={$us.user.password} id="password" name="password" type="password" autocomplete="new-password"
					class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
					placeholder="Mot de passe">
			</div> -->
		</div>

		<div>
			<label for="age" class="block text-sm font-medium text-gray-700">Age</label>
			<input type="range" id="age" min="18" max="100" bind:value={$us.user.age}
			class="slider mt-1 block w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer">
			<div class="flex justify-between text-sm text-gray-500">
				<span>18 ans</span>
				<span>{$us.user.age} ans</span>
				<span>100 ans</span>
			</div>
		</div>
		
		<!-- Bio -->
		<div class="mt-6">
			<label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
			<textarea bind:value={$us.user.biography} id="bio" name="bio" rows="3"
			class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
			placeholder="Parlez-nous de vous..."></textarea>
		</div>
  
		<!-- Paramètres de Confidentialité -->
		<div class="rounded-md shadow-sm -space-y-px">
			<h1 class="text-2xl font-bold mb-4">Mes Préférences</h1>
			<div class="mt-6">
				<label for="profile-gender" class="block text-sm font-medium text-gray-700">Genre</label>
				<select bind:value={$us.user.gender} id="profile-gender" name="profile-gender"
					class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
					<option value={EGender.Female}>Femme</option>
					<option value={EGender.Male}>Homme</option>
					<option value={EGender.Unknown}>Unkown</option>
				</select>
				<label for="profile-sex-orientation" class="block text-sm font-medium text-gray-700">Orientation</label>
				<select bind:value={$us.user.sexualPref} id="profile-sex-orientation" name="profile-sex-orientation"
					class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
					<option value={ESexualPref.Female}>Femme</option>
					<option value={ESexualPref.Male}>Homme</option>
					<option value={ESexualPref.Both}>Bisexual</option>
				</select>
				<div class="py-4">
					<Interest/>
				</div>
				<label for="profile-visibility" class="block text-sm font-medium text-gray-700">Visibilité du profil</label>
				<select bind:value={$us.user.profileVisibility} id="profile-visibility" name="profile-visibility"
					class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
					<option value={1}>Public</option>
					<option value={0}>Uniquement profils likés</option>
				</select>
				<label for="pref-Geoloc" class="block text-sm font-medium text-gray-700">Partager ma position avec</label>
				<select bind:value={$us.user.prefGeoloc} id="pref-Geoloc" name="pref-Geoloc"
					class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
					<option value={EGeoPref.Never}>Personne</option>
					<option value={EGeoPref.Always}>Tout le monde</option>
					<option value={EGeoPref.Match}>Uniquement mes matchs</option>
				</select>
		  </div>
		  <div class="pt-6 flex items-center">
				<input bind:checked={$us.user.emailNotifications} id="email-notifications" name="email-notifications" type="checkbox"
				  class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
				<label for="email-notifications" class="ml-2 block text-sm text-gray-900">
				  Recevoir des notifications par e-mail
				</label>
		  </div>
		</div>
  
		<!-- Distance pour les matches -->
		<div class="mt-6">
		  <label for="max-distance" class="block text-sm font-medium text-gray-700">Distance maximale pour les matches</label>
		  <input type="range" id="max-distance" min="1" max="200" bind:value={$us.user.maxDistance}
			class="slider mt-1 block w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer">
		  <div class="flex justify-between text-sm text-gray-500">
				<span>1 km</span>
				<span>{$us.user.maxDistance} km</span>
				<span>200 km</span>
		  </div>
		</div>

		<SliderRange bind:minAge={$us.user.matchAgeMin} bind:maxAge={$us.user.matchAgeMax}/>

		<!-- Bouton de Sauvegarde -->
		<div class="mt-6">
			<span class="text-xs">Sans enregistrer les préférences ne seront valides que pour la session en cours</span>
		  <button type="submit"
			class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
			Enregistrer les modifications
		  </button>
		</div>

		<!-- Gestion du Compte -->
		<div class="mt-6 space-y-6">
			<hr>
			<h1 class="text-2xl font-bold mb-4">Gestion du Compte</h1>
			<div class="">
				<label for="deconnect" class="block text-sm font-medium text-gray-700">Déconnexion</label>
				<div class="mt-1">
					<button id="deconnect" type="button"
					class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
					on:click={disconnect}>
					Déconnexion
					</button>
				</div>
				<label for="suspend-account" class="block text-sm font-medium text-gray-700">Suspendre mon compte</label>
				<div class="mt-1">
					<button id="suspend-account" type="button"
					class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
					on:click={suspendAccount}>
					Suspendre mon compte
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