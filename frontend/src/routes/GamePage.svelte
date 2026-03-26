<!-- Page-level UI layou for :
  room panel
  score panel
  chat panel
  GameCanvas
  maybe overlay labels like “Waiting for players” -->

<!-- page-level shell -->
<!-- <script>
  import GameCanvas from '../components/game/GameCanvas.svelte';
</script>

<main class="game-page">
  <section class="game-header">
    <h1>Online Snake</h1>
    <p>Canvas bootstrap test for the multiplayer game.</p>
  </section>

  <section class="game-layout">
    <GameCanvas />
  </section>
</main>

<style>
  .game-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    box-sizing: border-box;
  }

  .game-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .game-header h1 {
    margin: 0;
    font-size: 2rem;
  }

  .game-header p {
    margin: 0;
    opacity: 0.8;
  }

  .game-layout {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style> -->
<script>
  import GameCanvas from '../components/game/GameCanvas.svelte';
  import { authStore } from '../stores/authStore';
  import { navigateTo } from '../stores/router';

  const mode = 'multiplayer';

  const wsUrl = 'ws://localhost:8080/ws';
  const roomId = 1;

  let token = '';
  let isReady = false;

  $: token = $authStore.sessionToken ?? '';
  $: isReady = $authStore.isLoggedIn && token.length > 0;

  $: if (!isReady) {
    navigateTo('/login');
  }
</script>

<main class="game-page">
  <section class="game-header">
    <h1>Online Snake</h1>
    <p>Multiplayer integration test.</p>
  </section>

  <section class="game-layout">
    {#if isReady}
      <GameCanvas {mode} {wsUrl} {token} {roomId} />
    {/if}
  </section>
</main>

<style>
  .game-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    box-sizing: border-box;
  }

  .game-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .game-header h1 {
    margin: 0;
    font-size: 2rem;
  }

  .game-header p {
    margin: 0;
    opacity: 0.8;
  }

  .game-layout {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>