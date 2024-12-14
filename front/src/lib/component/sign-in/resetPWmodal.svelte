<script lang="ts">
	import { resetUserPassword } from "../../../service/user";
	import { us } from "../../../store/userStore";
  export let showModalResetPW = false;
  export let passwordChanged = false;
  export let resetPasswordToken = '';

  let secondPasswordEntry = '';

  let arePasswordsSame = true;
  let isPasswordStrongEnough = true;

  let passwordStrengthMessage = '';
  let samePasswordMessage = '';
  let errorInInputMessage = '';


  function closeModal() {
    showModalResetPW = false;
  }

  async function handleSubmit() {
    if (!isPasswordStrongEnough || !arePasswordsSame) {
      errorInInputMessage = 'Veuillez remplir correctement tous les champs!';
      return;
    }

    const response = await resetUserPassword(resetPasswordToken, $us.user.password);
    if (response.status != 200) {
      errorInInputMessage = `Le mot de passe entré n'as pas fonctionné : ${response.response.data.message}`;
      return;
    }
    passwordChanged = true;
    setTimeout(() => {
      passwordChanged = false;
    }, 5000);
    closeModal();
  }

  function validatePassword() {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test($us.user.password);
    const hasLowerCase = /[a-z]/.test($us.user.password);
    const hasNumber = /[0-9]/.test($us.user.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test($us.user.password);
    const hasNoSpaces = !/\s/.test($us.user.password);

    isPasswordStrongEnough =
        $us.user.password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar &&
        hasNoSpaces;

    passwordStrengthMessage = isPasswordStrongEnough
        ? "Mot de passe fort"
        : "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
  }

  function validateSamePassword() {

    arePasswordsSame = $us.user.password === secondPasswordEntry;

    samePasswordMessage = arePasswordsSame
        ? "Les mots de passe correspondent"
        : "Les mots de passe ne correspondent pas.";
  }
</script>

{#if showModalResetPW}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <button class="absolute top-2 right-2 cursor-pointer text-gray-600" type="button" on:click={closeModal}>&times;</button>
      <h2 class="text-lg font-semibold mb-4">Reset Password</h2>
      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-md font-bold leading-6 text-gray-900" >Password</label>
        </div>
        <div class="mt-2">
          <input bind:value={$us.user.password} on:input={validatePassword} id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <p class="mt-2 text-sm {isPasswordStrongEnough ? 'text-green-500' : 'text-red-500'}">
            {passwordStrengthMessage}
          </p>
        </div>
        <div class="mt-2">
          <input bind:value={secondPasswordEntry} on:input={validateSamePassword} id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <p class="mt-2 text-sm {arePasswordsSame ? 'text-green-500' : 'text-red-500'}">
            {samePasswordMessage}
          </p>
        </div>
        <p class="mt-2 text-sm text-red-500">
          <b>{errorInInputMessage}</b>
        </p>
      </div>
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