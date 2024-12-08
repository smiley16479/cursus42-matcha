<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { app } from "@/store/appStore";
  import Btn from "@/lib/component/btn/btn.svelte";
  import { logout } from "@/service/user";
  import { us } from "@/store/userStore";
  import { LoggingState } from "@/type/user";
	import { closeSocket } from "@/store/socketStore";
  const go2Matcha = () => {
    $app.tabIdx = 1;
    $app.footer = true
    goto("/app/matcha");
  }

  async function signOut() {
    try {
      await logout();
      closeSocket();
      $us.logState = LoggingState.unlogged;
      $app.tabIdx = 0;
      goto('/')
    } catch (error) {
      console.warn(`error`, error);
      throw error;
    }
  }
</script>

<header class="sticky top-0 pt-4 px-4 flex justify-between items-center pointer-events-none">
  <button class="font-bold text-2xl text-black pointer-events-auto" on:click={go2Matcha}>
    Matcha
  </button>
  <span class="end pointer-events-auto">
    <button on:click={signOut}>
      <img class="h-16" src="/svg.svg" alt="Matcha-Frida" title="Déconnexion">
    </button>
  </span>
</header>