<script lang="ts">
	import { goto } from "$app/navigation";
	import { app } from "../../../store/appStore";
  import { onMount, afterUpdate } from "svelte";
  import { us } from "@/store/userStore";
  // Propriétés du composant
  export let content: { title: string, icon: string, href: string }[] = [
    { title: "Acceuil", icon: "" , href: "/accueil"},
    { title: "Matcha", icon: "" , href: "/matcha"},
    { title: "Frida", icon: "" , href: "/frida"},
    { title: "Profil", icon: "", href: "/profil" }
  ];
  
  let tabsContainer: HTMLUListElement;
  let movingTab: HTMLElement;
  
	// NOTIFICATIONS
	// $: chatCount = $us.user.chats.length;

  // Positionne le surlignage lors de la première montée du composant
  onMount(() => {
    setActiveTab($app.tabIdx);
  });
  
  // Met à jour la position du surlignage lorsque `$app.tabIdx` change
  afterUpdate(() => {
    setActiveTab($app.tabIdx);
  });
  
  function setActiveTab(index: number) {
    if (!tabsContainer || !movingTab) return;
  
    const tabs = tabsContainer.children;
    const currentTab = tabs[index] as HTMLElement;
  
    if (!currentTab) return;
  
    const { offsetWidth, offsetLeft } = currentTab;
  
    movingTab.style.width = `${offsetWidth}px`;
    movingTab.style.transform = `translate3d(${offsetLeft}px, 0, 0)`;
  }
  
  function handleTabClick(index: number) {
    const idx = content.findIndex(e => e.href.includes(content[index].href))
    $app.tabIdx = idx //index;
    goto("/app" + content[index].href);
  }
</script>
  
<style>
  .moving-tab {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: blue;
    transition: all 0.5s ease;
  }
</style>
  
<div class="w-full">
  <div class="relative">
    <ul class="relative flex flex-wrap p-1 list-none rounded-lg bg-blue-gray-50/60" bind:this={tabsContainer}>
    {#each content as item, index}
      <li class="flex-auto text-center">
      <button
        class="flex items-center relative justify-center w-full px-0 py-1 mb-0 transition-all ease-in-out border-0 rounded-lg cursor-pointer text-slate-700 bg-inherit"
        role="tab"
        on:click={() => handleTabClick(index)}
        aria-selected={index === $app.tabIdx}
      >
        <span class="ml-1">{item.title}</span>
        {#if item.title === "Matcha" && $us.user.notifications.length}
          <span class="relative bottom-2 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full"
            aria-label="Notification Count"
          >
            {$us.user.notifications.length}
          </span>
        {/if}
      </button>
      </li>
    {/each}
    <div class="moving-tab" bind:this={movingTab}></div>
    </ul>
  </div>
</div>