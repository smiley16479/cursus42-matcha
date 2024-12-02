<script>
  let showExplosion = true;
</script>

<div class="container">
  {#if showExplosion}
    <div class="message">🎉 C'est un Match ! 🎉</div>
  {/if}
</div>

<style>

.container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .message {
    font-size: 48px;
    font-weight: bold;
    color: #0bec3c;
    text-align: center;
    opacity: 0;
    animation: fadeIn 1s ease forwards;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
</style>