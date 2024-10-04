<script lang="ts">
  import { resetUserPassword } from "@/service/user";
  export let showModalPW = false;
  let email = '';

  function closeModal() {
    showModalPW = false;
  }

  function handleSubmit() {
    // Gérer l'envoi de l'e-mail pour la réinitialisation du mot de passe
    console.log("Email pour réinitialiser le mot de passe :", email);
    if (email)
      resetUserPassword(email);
    closeModal();
  }
</script>

{#if showModalPW}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <button class="absolute top-2 right-2 cursor-pointer text-gray-600" type="button" on:click={closeModal}>&times;</button>
      <h2 class="text-lg font-semibold mb-4">Reset Password</h2>
      <p class="mb-4">Please enter your email address:</p>
      <input 
        type="email" 
        bind:value={email} 
        required 
        placeholder="Email" 
        class="border rounded-md w-full p-2 mb-4 focus:ring-2 focus:ring-indigo-600"
      />
      <button 
        class="bg-indigo-600 text-white w-full py-2 rounded mb-4"
        on:click={handleSubmit}
      >
        Submit
      </button>
      <button 
        class="bg-indigo-600 text-white w-full py-2 rounded"
        type="button"
        on:click={closeModal}
      >
        Cancel
      </button>
    </div>
  </div>
{/if}