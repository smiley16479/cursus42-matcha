<script lang="ts">
	import { afterUpdate } from "svelte";
	import { us } from "../../../store/userStore";
	import type { Chat_c } from "@/type/shared_type/chat";

  export let chat: Chat_c;
  let msgContainer: HTMLElement;
  $us.user.id = 2

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
            <img src={/* chat.interlocutor. || */ "https://pagedone.io/asset/uploads/1710412177.png"} alt="Shanay" class="w-10 h-11 rounded-full">
          {/if}
          <div class="grid">
            {#if !index || chat.msg[index -1].userId !== chat.msg[index].userId }
              <h5 class="text-gray-900 text-sm font-semibold leading-snug pb-1">{chat.interlocutor?.userName || "Shanay cruz"}</h5>
              <div class="w-max grid">
                <div class="px-3.5 py-2 bg-gray-100 rounded justify-start items-center gap-3 inline-flex">
                  <h5 class="text-gray-900 text-sm font-normal leading-snug">{msg.content}</h5>
                </div>
                <div class="justify-end items-center inline-flex mb-2.5">
                  <h6 class="text-gray-500 text-xs font-normal leading-4 py-1">{msg.createdAt}</h6>
                </div>
              </div>
            {:else}
              <div class="w-max grid ml-12">
                <div class="px-3.5 py-2 bg-gray-100 rounded justify-start items-center gap-3 inline-flex">
                  <h5 class="text-gray-900 text-sm font-normal leading-snug">{msg.content}</h5>
                </div>
                <div class="justify-end items-center inline-flex mb-2.5">
                  <h6 class="text-gray-500 text-xs font-normal leading-4 py-1">{msg.createdAt}</h6>
                </div>
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
            <div class="justify-start items-center inline-flex">
              <h3 class="text-gray-500 text-xs font-normal leading-4 py-1">{msg.createdAt}</h3>
            </div>
          </div>
          {:else}

          <div class="justify-center">
            <div class="grid w-fit ml-auto mr-12">
              <div class="px-3 py-2 bg-indigo-600 rounded ">
                <h2 class="text-white text-sm font-normal leading-snug">{msg.content}</h2>
              </div>
              <div class="justify-start items-center inline-flex">
                <h3 class="text-gray-500 text-xs font-normal leading-4 py-1">{msg.createdAt}</h3>
              </div>
            </div>
          </div>
          {/if}

        </div>
        <!-- ça ne marchera pas il faut le mettre dans une URL -->
        {#if !index || chat.msg[index -1].userId !== chat.msg[index].userId }
          <img src={"https://pagedone.io/asset/uploads/1704091591.png"} alt="Pic" class="w-10 h-11  rounded-full">
        {/if}
      </div>
    {/if}
  {/each}
</div>