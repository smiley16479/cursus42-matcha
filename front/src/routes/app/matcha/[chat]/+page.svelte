<script lang="ts">
  import Chat from "$lib/elem/chat/chat.svelte";
  /** @type {import('./$types').PageData} */
  export let data : any;
</script>

<Chat /> <!-- chat={data[0]} -->
