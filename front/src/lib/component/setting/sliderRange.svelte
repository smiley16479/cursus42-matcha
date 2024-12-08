<script lang="ts">
  export let fromSlider = 10;
  export let toSlider = 30;
</script>

<div class="range_container">
  <label for="fromSlider" class="block text-sm font-medium text-gray-700 mb-1">Intervale d'age pour les matches</label>
  <div class="sliders_control">
    <input class="absolute top-1 bg-gray-300" on:input={(event) => {fromSlider = +event.currentTarget.value}} id="fromSlider" type="range" value={fromSlider} min="18" max="100"/>
    <input class="absolute bg-gray-300" on:input={(event) => {toSlider = +event.currentTarget.value}} id="toSlider" type="range" value={toSlider} min="20" max="100"/>
    <div class="flex justify-between text-sm text-gray-500 mt-2">
      <span>18 ans</span>
      <span>100 ans</span>
    </div>
  </div>
  <div class="text-gray-500">
    De {fromSlider} à {toSlider}
  </div>
</div>

<style>
.range_container {
  display: flex;
  flex-direction: column;
  margin: 100px auto;
}

.sliders_control {
  position: relative;
  min-height: 20px;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: all;
  background-color: #fff;
  box-shadow: 0 0 0 1px #C6C6C6;
  cursor: pointer;
}

input[type=range]::-moz-range-thumb {
  -webkit-appearance: none;
  pointer-events: all;
  background-color: #fff;
  box-shadow: 0 0 0 1px #C6C6C6;
  cursor: pointer;  
}

input[type=range]::-webkit-slider-thumb:hover {
  background: #f7f7f7;
}

input[type=range]::-webkit-slider-thumb:active {
  box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
  -webkit-box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
}

input[type="number"] {
  color: #8a8383;
  width: 50px;
  height: 30px;
  font-size: 20px;
  border: none;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {  
    opacity: 1;
}

input[type="range"] {
  -webkit-appearance: none; 
  appearance: none;
  height: 8px;
  border-radius: 10px;
  width: 100%;
  position: absolute;
  pointer-events: none;
}

#fromSlider {
  height: 0;
  z-index: 1;
}
</style>


<!-- AUTRE TENTATIVE COMPATIBLE POUR CHROME -->
<!-- 
<script lang="ts">
  import { onMount } from "svelte";

  let minprice = 18; // Valeur minimale actuelle
  let maxprice = 100; // Valeur maximale actuelle
  const min = 0; // Limite inférieure
  const max = 100; // Limite supérieure
  let minthumb = 0; // Position de la poignée gauche
  let maxthumb = 100; // Position de la poignée droite

  // Met à jour la position du curseur gauche
  const mintrigger = () => {
    // minprice = Math.min(minprice, maxprice - 500);
    minthumb = ((minprice - min) / (max - min)) * 100;
  };

  // Met à jour la position du curseur droit
  const maxtrigger = () => {
    // maxprice = Math.max(maxprice, minprice + 500);
    maxthumb = 100 - ((maxprice - min) / (max - min)) * 100;
  };

  // Initialisation
  onMount(() => {
    mintrigger();
    maxtrigger();
  });
</script>

<div class="flex justify-center items-center">
  <div class="relative max-w-xl w-full">
    <div>
      !-- Curseur gauche --
      <input
        type="range"
        step="1"
        min={min}
        max={max}
        bind:value={minprice}
        on:input={mintrigger}
        class="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
      />

      !-- Curseur droit --
      <input
        type="range"
        step="1"
        min={min}
        max={max}
        bind:value={maxprice}
        on:input={maxtrigger}
        class="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0 cursor-pointer"
      />

      <div class="relative z-10 h-2">
        !-- Fond gris --
        <div class="absolute z-10 left-0 right-0 bottom-0 top-0 rounded-md bg-gray-300"></div>
        !-- Plage sélectionnée --
        !-- <div
          class="absolute z-20 top-0 bottom-0 rounded-md bg-green-300"
          style="right: {maxthumb}%; left: {minthumb}%;"
        ></div> --
        !-- Poignée gauche --
        <div
          class="absolute z-30 w-5 h-5 top-0.5 bg-gray-100 border border-gray-400 rounded-full -mt-2 -ml-1"
          style="left: {minthumb}%;"
        ></div>
        !-- Poignée droite --
        <div
          class="absolute z-30 w-5 h-5 top-0.5 bg-gray-100 border border-gray-400 rounded-full -mt-2 -mr-3"
          style="right: {maxthumb}%;"
        ></div>
      </div>
    </div>

    !-- Entrées pour les valeurs --
    !--  <div class="flex justify-between items-center py-5">
      <div>
        <input
          type="number"
          maxlength="100"
          bind:value={minprice}
          on:input={mintrigger}
          class="px-3 py-2 border border-gray-200 rounded w-24 text-center"
        />
      </div>
      <div>
        <input
          type="number"
          maxlength="100"
          bind:value={maxprice}
          on:input={maxtrigger}
          class="px-3 py-2 border border-gray-200 rounded w-24 text-center"
        />
      </div>
    </div> --
    De {minthumb} à {maxthumb}

  </div>
</div>

<style>
/* <div class="range_container">
  <div class="text-gray-500">
    De {fromSlider} à {toSlider}
  </div>
</div>
.range_container {
  display: flex;
  flex-direction: column;
  margin: 100px auto;
} */



  /* Pour Chrome, Safari et Edge */
input[type="range"]::-webkit-slider-thumb {
  pointer-events: all;
  width: 24px;
  height: 24px;
  -webkit-appearance: none;
  background-color: #4caf50; /* Couleur de fond #d1d5db */
  border-radius: 50%; /* Forme ronde */
}

/* Pour Firefox */
input[type="range"]::-moz-range-thumb {
  pointer-events: all;
  width: 24px;
  height: 24px;
  background-color: #4caf50; /* Couleur de fond #f0f0f0 */
  border-radius: 50%; /* Forme ronde */
}

/* Pour les autres navigateurs */
input[type="range"] {
  -webkit-appearance: none; /* Pour masquer le style par défaut sur WebKit */
  appearance: none; /* Pour masquer le style par défaut */
  height: 8px;
  border-radius: 10px;
  width: 100%;
  background-color: #ddd; /* Couleur de fond du rail */
}

</style> -->