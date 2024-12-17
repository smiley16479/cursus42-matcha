<script lang="ts">
  export let showModal = false;
  export let eventDetails: {
    image: string;
    title: string;
    description: string;
    txt: string;
    date: string;
    location: string;
    time: string;
  };

  function closeModal() {
    showModal = false;
  }
</script>

{#if showModal}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" on:click={closeModal} role="button" tabindex="0"on:keydown={()=> {}}>
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full" on:click|stopPropagation role="button" tabindex="0"on:keydown={()=> {}}>
      <img src={eventDetails.image} alt={eventDetails.title} class="w-full h-48 object-cover">
      <h2 class="text-xl font-bold mb-4">{eventDetails.title}</h2>
      <p class="mb-2">{eventDetails.description}</p>
      <p class="font-semibold"><strong>Date :</strong> {eventDetails.date}</p>
      <p class="font-semibold"><strong>Lieu :</strong> {eventDetails.location}</p>
      <p class="font-semibold"><strong>Heure :</strong> {eventDetails.time}</p>
      <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" on:click={closeModal}>Fermer</button>
    </div>
  </div>
{/if}