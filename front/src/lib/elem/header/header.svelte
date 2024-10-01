<script lang="ts">
	import { goto } from "$app/navigation";
	import ProfileDropdown from "./profileDropdown.svelte";
	import { app } from "@/store/appStore";

  const go2Matcha = () => {
    $app.tabIdx = 1;
    goto("/app/matcha");
  }
</script>

<header class="sticky top-0 pt-4 px-4 flex justify-between">
  <button class="font-bold text-2xl text-black" on:click={go2Matcha}>
    Matcha
  </button>
  <span class="end">
    <ProfileDropdown/>
  </span>
</header>