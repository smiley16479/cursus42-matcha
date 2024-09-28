<!-- SVG avec animation pour LIKE -->
<div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    class="stamp-animation"
    width="200"
    height="200"
    >
    <rect x="10" y="10" width="80" height="80" fill="transparent" stroke="green" stroke-width="5" />
    <text x="50%" y="50%" fill="green" font-size="20" text-anchor="middle" dominant-baseline="middle">
      LIKE
    </text>
  </svg>
</div>

<style>
  /* Animation de type "scale" avec rebond */
  .stamp-animation {
    animation: stampEffect 0.5s ease-out forwards;
  }

  @keyframes stampEffect {
    0% {
      transform: scale(0);  /* Départ hors écran */
      opacity: 0;
    }
    60% {
      transform: scale(1.2);  /* Légère expansion */
      opacity: 1;
    }
    100% {
      transform: scale(1);  /* Revient à sa taille normale */
      opacity: 1;
    }
  }
</style>