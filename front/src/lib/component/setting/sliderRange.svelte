<script lang="ts">
  export let fromSlider = 10;
  export let toSlider = 30;
</script>

<!-- Age min/max pour les matches -->
<div class="range_container">
  <label for="fromSlider" class="block text-sm font-medium text-gray-700 mb-1">Intervale d'age pour les matches</label>
  <div class="sliders_control">
    <input class="absolute top-1 bg-gray-300" on:input={(event) => {fromSlider = event?.target?.value}} id="fromSlider" type="range" value="20" min="18" max="100"/>
    <input class="absolute bg-gray-300" on:input={(event) => {toSlider = event?.target?.value}} id="toSlider" type="range" value="30" min="20" max="100"/>
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