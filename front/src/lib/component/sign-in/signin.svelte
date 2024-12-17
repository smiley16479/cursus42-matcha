<script lang="ts">
import Background from "../background/background.svelte";
import ForgotPWmodal from "./forgotPWmodal.svelte";
import { goto } from "$app/navigation";
import { createUser, login } from "@/service/user";
import { refreshNotif, us } from "@/store/userStore";
import { LoggingState } from '@/type/user';
import { app } from "@/store/appStore";
import { initializeSocket } from '@/store/socketStore';
import { page } from '$app/stores';
import { onMount } from "svelte";
import { fly } from "svelte/transition";
import ResetPWmodal from "./resetPWmodal.svelte";
	import { decodeHtmlEntities } from "../../../service/util/sharedFunction";

let signUpMode = false;
let showModalPW = false;
let showModalResetPW = false;
let passwordRecovery = false;
let passwordChanged = false;
let showEmailValidatedMessage = true;
let emailVerified = $page.url.searchParams.get('emailVerified');
let resetPasswordToken = $page.url.searchParams.get('token');

if ($page.url.searchParams.get('resetPassword') !== null)
  showModalResetPW = true;

onMount(()=> {
  setTimeout(() => {
    showEmailValidatedMessage = false;
  }, 5000);
});

function openForgotPWModal() {
    showModalPW = true;
}

function signUpIn_Toggle() {
  signUpMode = !signUpMode;
}

async function handleFormSubmit() {
  if (signUpMode) {
    createUser($us.user); // WARNING
    goto("/app/accueil");
  }
  else 
    signIn();
  // $us.user.password = "";
}

function orderTabs() {
  $us.user.liking.sort((a, b) => new Date((a as  any).date).getTime() - new Date((b as any).date).getTime());
  $us.user.likedBy.sort((a, b) => new Date((a as  any).date).getTime() - new Date((b as any).date).getTime());
  $us.user.notifications.sort((a, b) => new Date((a as  any).date).getTime() - new Date((b as any).date).getTime());
  $us.user.matchEvents.sort((a, b) => new Date((a as  any).date).getTime() - new Date((b as any).date).getTime());
  refreshNotif();
}

function isProfilCompleted() {
  const u = $us.user;
  if (u.pictures.length && u.interests.length && u.biography)
    return true;

  $app.tabIdx = 3;
  if ($us.logState === LoggingState.logged)
    alert("Vous devez renseigner au moins votre bio un intéret et mettre une photo pour utiliser l'application");
  goto("/app/profil");
  return false;
}

async function signIn() {
  try {
    const pwd = $us.user.password;
    const resp = await login({userName: $us.user.userName, password: $us.user.password})
    console.log(`resp`, resp);
    if (resp?.status === 200) {
      $us.logState = LoggingState.logged;
      $app.footer = true;
      $app.tabIdx = 0;
      $us.user = {...resp.data, connectedUser: []};
      // Garde la password sinon on ne peut pas resignIn sur app/accueil
      $us.user.password = pwd;
      $us.avatar = "http://localhost:3000/api/user/picture/" + $us.user.pictures[0]?.filename;
      if (isProfilCompleted())
        goto("/app/accueil");
      orderTabs();
      $us.user.biography = decodeHtmlEntities($us.user.biography);
      initializeSocket();
      console.log(`$us.user`, $us.user);
    } else
      alert('Failed to login. Please check your credentials.');
  } catch (error) {
    console.log(`error`, error);
  }
}

  let passwordStrengthMessage = '';

  function validatePassword() {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test($us.user.password);
      const hasLowerCase = /[a-z]/.test($us.user.password);
      const hasNumber = /[0-9]/.test($us.user.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test($us.user.password);
      const hasNoSpaces = !/\s/.test($us.user.password);

      const isStrong =
          $us.user.password.length >= minLength &&
          hasUpperCase &&
          hasLowerCase &&
          hasNumber &&
          hasSpecialChar &&
          hasNoSpaces;

      passwordStrengthMessage = isStrong
          ? "Mot de passe fort"
          : "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
  }

</script>

<Background>
  {#if emailVerified !== null && showEmailValidatedMessage}
  <div class="absolute w-full px-6 py-4 lg:px-8" transition:fly={{ x: 0, y: -200 }}>
    <div class="flex flex-row justify-center bg-green-400/50 backdrop-blur shadow-lg rounded-lg min-h-12">
      <p class="flex flex-col justify-center text-gray-900"><b class="align-middle">Your email has been verified 👍</b></p>
    </div>
  </div>
  {/if}
  {#if passwordRecovery}
  <div class="absolute w-full px-6 py-4 lg:px-8" transition:fly={{ x: 0, y: -200 }}>
    <div class="flex flex-row justify-center bg-green-400/50 backdrop-blur shadow-lg rounded-lg min-h-12">
      <p class="flex flex-col justify-center text-gray-900"><b class="align-middle">Recovery email was sent 👍</b></p>
    </div>
  </div>
  {/if}
  {#if passwordChanged}
  <div class="absolute w-full px-6 py-4 lg:px-8" transition:fly={{ x: 0, y: -200 }}>
    <div class="flex flex-row justify-center bg-green-400/50 backdrop-blur shadow-lg rounded-lg min-h-12">
      <p class="flex flex-col justify-center text-gray-900"><b class="align-middle">Your password has been successfully changed 👍</b></p>
    </div>
  </div>
  {/if}
  <div class="flex h-full flex-col justify-center px-6 py-12 lg:px-8 bg">
    <div class="backdrop-blur bg-white/50 shadow-lg rounded-lg">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-50 w-auto" src="/icon.svg" alt="Your Company">
        <h2 class="text-center text-4xl text-indigo-600 font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
      </div>

      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-2" on:submit|preventDefault={handleFormSubmit}>

          {#if signUpMode}
            <div>
              <label for="email" class="block text-md font-bold leading-6 text-gray-900">Email address</label>
              <div class="mt-2">
                <input bind:value={$us.user.email} id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              </div>
            </div>
          
            <div>
              <label for="firstname" class="block text-md font-bold leading-6 text-gray-900">firstname</label>
              <div class="mt-2">
                <input bind:value={$us.user.firstName} id="firstname" name="firstname" type="text" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              </div>
            </div>
          
            <div>
              <label for="lastname" class="block text-md font-bold leading-6 text-gray-900">lastname</label>
              <div class="mt-2">
                <input bind:value={$us.user.lastName} id="lastname" name="lastname" type="text" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              </div>
            </div>
          {/if}

          <div>
            <label for="username" class="block text-md font-bold leading-6 text-gray-900">username</label>
            <div class="mt-2">
            <input bind:value={$us.user.userName} id="username" name="username" type="username" autocomplete="username" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-md font-bold leading-6 text-gray-900" >Password</label>
              {#if !signUpMode}
                <button class="text-sm" type="button" on:click={openForgotPWModal}>
                  <span class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</span>
                </button>
              {/if}
            </div>
            <div class="mt-2">
              <input bind:value={$us.user.password} on:input={validatePassword} id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              {#if signUpMode}
                <p class="mt-2 text-sm {passwordStrengthMessage.includes('fort') ? 'text-green-500' : 'text-red-500'}">
                  {passwordStrengthMessage}
                </p>
              {/if}
            </div>
          </div>

          <div>
            <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{signUpMode ? "Sign up" : "Sign in"}</button>
            <!-- 
              on:click={()=> {
              /* if (user.name === "test" && user.mdp === "test") {loggedIn = true; /* goto("/app") /* } */ 
              if (signUpMode)
                create
              else
                signIn}}
             -->
          </div>
        </form>
      
        <p class="mt-10 text-center text-sm text-gray-500">
          {signUpMode ? "Already a member?" : "Not a member?"}
          <button 
            on:click={signUpIn_Toggle}
            class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 pb-10">{signUpMode ? "Sign-in" : "Sign-up"}</button>
        </p>
      </div>
    </div>
  </div>
  <footer class="flex">
    <p class="flex w-full fixed bottom-0 bg-white justify-center">Developped with love 💟 of Matcha's Team</p>
  </footer>

  <ForgotPWmodal bind:showModalPW bind:passwordRecovery/>
  <ResetPWmodal bind:showModalResetPW bind:resetPasswordToken bind:passwordChanged/>
</Background>