<!-- SVG avec animation pour "NOPE" -->
<div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    class="nope-animation"
    width="200"
    height="200"
  >
    <rect x="10" y="10" width="80" height="80" fill="transparent" stroke="red" stroke-width="5" />
    <text x="50%" y="50%" fill="red" font-size="20" text-anchor="middle" dominant-baseline="middle">
      NOPE
    </text>
  </svg>
</div>

<style>
  /* Animation de type "scale" avec vibration */
  .nope-animation {
  animation: nopeEffect 0.5s ease-out forwards;
}

@keyframes nopeEffect {
  0% {
    transform: scale(0);  /* Départ hors écran */
    opacity: 0;
  }
  60% {
    transform: scale(1.1) rotate(-5deg);  /* Expansion avec légère rotation */
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0);  /* Retour à la taille normale */
    opacity: 1;
  }
}
</style>