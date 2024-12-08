<script lang="ts">
	import { afterUpdate, onMount } from "svelte";
	import { us } from "../../../store/userStore";
	import type { Chat_c } from "@/type/shared_type/chat";

  export let chat: Chat_c;
  let msgContainer: HTMLElement;
  let pic = chat.interlocutor?.pictures?.[0].filename;

  onMount(()=> {
    console.log(`chat.interlocutor?.userName `, chat.interlocutor?.userName );
  })


  // Fonction pour faire défiler vers le bas
  function scrollToBottom() {
    if (msgContainer) {
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }
  }

  // Appel après la mise à jour
  afterUpdate(scrollToBottom);
</script>

current userId: {$us.user.id}
<div  class="max-h-[80vh] overflow-y-auto" bind:this={msgContainer}>
  {#each chat.msg as msg, index}
    <!-- msg Received -->
    {#if $us.user.id !== msg.userId}
      <div class="grid">
        <div class="flex gap-2.5">
          {#if !index || chat.msg[index -1].userId !== chat.msg[index].userId }
            {#if pic}
              <img src={pic.includes('localhost') ? pic : "http://localhost:3000/api/user/picture/" + pic } alt="Shanay" class="w-11 h-11 object-cover rounded-full">
            {:else}
              <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512">
                <path fill-rule="nonzero" d="M256 0c70.69 0 134.7 28.66 181.02 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.7 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.7 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-21.49 301.51v-2.03c.16-13.46 1.48-24.12 4.07-32.05 2.54-7.92 6.19-14.37 10.97-19.25 4.77-4.92 10.51-9.39 17.22-13.46 4.31-2.74 8.22-5.78 11.68-9.18 3.45-3.36 6.19-7.27 8.23-11.69 2.02-4.37 3.04-9.24 3.04-14.62 0-6.4-1.52-11.94-4.57-16.66-3-4.68-7.06-8.28-12.04-10.87-5.03-2.54-10.61-3.81-16.76-3.81-5.53 0-10.81 1.11-15.89 3.45-5.03 2.29-9.25 5.89-12.55 10.77-3.3 4.87-5.23 11.12-5.74 18.74h-32.91c.51-12.95 3.81-23.92 9.85-32.91 6.1-8.99 14.13-15.8 24.08-20.42 10.01-4.62 21.08-6.9 33.16-6.9 13.31 0 24.89 2.43 34.84 7.41 9.96 4.93 17.73 11.83 23.27 20.67 5.48 8.84 8.28 19.1 8.28 30.88 0 8.08-1.27 15.34-3.81 21.79-2.54 6.45-6.1 12.24-10.77 17.27-4.68 5.08-10.21 9.54-16.71 13.41-6.15 3.86-11.12 7.82-14.88 11.93-3.81 4.11-6.56 8.99-8.28 14.58-1.73 5.63-2.69 12.59-2.84 20.92v2.03h-30.94zm16.36 65.82c-5.94-.04-11.02-2.13-15.29-6.35-4.26-4.21-6.35-9.34-6.35-15.33 0-5.89 2.09-10.97 6.35-15.19 4.27-4.21 9.35-6.35 15.29-6.35 5.84 0 10.92 2.14 15.18 6.35 4.32 4.22 6.45 9.3 6.45 15.19 0 3.96-1.01 7.62-2.99 10.87-1.98 3.3-4.57 5.94-7.82 7.87-3.25 1.93-6.86 2.9-10.82 2.94zM417.71 94.29C376.33 52.92 319.15 27.32 256 27.32c-63.15 0-120.32 25.6-161.71 66.97C52.92 135.68 27.32 192.85 27.32 256c0 63.15 25.6 120.33 66.97 161.71 41.39 41.37 98.56 66.97 161.71 66.97 63.15 0 120.33-25.6 161.71-66.97 41.37-41.38 66.97-98.56 66.97-161.71 0-63.15-25.6-120.32-66.97-161.71z"/>
              </svg>
            {/if}
          {/if}
          <div class="grid">
            {#if !index || chat.msg[index -1].userId !== chat.msg[index].userId }
              <h5 class="text-gray-900 text-sm font-semibold leading-snug pb-1">{chat.interlocutor?.userName || "Shanay cruz"}</h5>
              <div class="w-max grid">
                <div class="px-3.5 py-2 bg-gray-100 rounded justify-start items-center gap-3 inline-flex">
                  <h5 class="text-gray-900 text-sm font-normal leading-snug">{msg.content}</h5>
                </div>
                <!-- <div class="justify-end items-center inline-flex mb-2.5">
                  <h6 class="text-gray-500 text-xs font-normal leading-4 py-1">{msg.createdAt}</h6>
                </div> -->
              </div>
            {:else}
              <div class="w-max grid ml-12">
                <div class="px-3.5 py-2 bg-gray-100 rounded justify-start items-center gap-3 inline-flex">
                  <h5 class="text-gray-900 text-sm font-normal leading-snug">{msg.content}</h5>
                </div>
                <!-- <div class="justify-end items-center inline-flex mb-2.5">
                  <h6 class="text-gray-500 text-xs font-normal leading-4 py-1">{msg.createdAt}</h6>
                </div> -->
              </div>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <!-- msg sent -->
      <div class="flex gap-2.5 justify-end">
        <div class="grid">
          {#if !index || chat.msg[index -1].userId !== chat.msg[index].userId }

          <div class="grid mb-2">
            <h5 class="text-right text-gray-900 text-sm font-semibold leading-snug pb-1">You</h5>
            <div class="px-3 py-2 bg-indigo-600 rounded">
              <h2 class="text-white text-sm font-normal leading-snug">{msg.content}</h2>
            </div>
            <!-- <div class="justify-start items-center inline-flex">
              <h3 class="text-gray-500 text-xs font-normal leading-4 py-1">{msg.createdAt}</h3>
            </div> -->
          </div>
          {:else}

          <div class="justify-center">
            <div class="grid w-fit ml-auto mr-12">
              <div class="px-3 py-2 bg-indigo-600 rounded ">
                <h2 class="text-white text-sm font-normal leading-snug">{msg.content}</h2>
              </div>
              <!-- <div class="justify-start items-center inline-flex">
                <h3 class="text-gray-500 text-xs font-normal leading-4 py-1">{msg.createdAt}</h3>
              </div> -->
            </div>
          </div>
          {/if}

        </div>
        <!-- ça ne marchera pas il faut le mettre dans une URL -->
        {#if !index || chat.msg[index -1].userId !== chat.msg[index].userId }
          <img src={$us.avatar || "https://pagedone.io/asset/uploads/1704091591.png"} alt="Pic" class="w-11 h-11 object-cover rounded-full">
        {/if}
      </div>
    {/if}
  {/each}
</div>