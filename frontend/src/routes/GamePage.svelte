<!-- Page-level UI layou for :
  room panel
  score panel
  chat panel
  GameCanvas
  maybe overlay labels like “Waiting for players” -->

<!-- page-level shell -->
<script>
  import LocalSnakeCanvas from '../components/game/LocalSnakeCanvas.svelte';
</script>

<main class="game-page">
  <section class="game-header">
    <h1>BLACK MAMBA</h1>
    <h2 style="color:red">SOLO</h2>
  </section>

  <section class="game-layout">
    <LocalSnakeCanvas />
  </section>
</main>

<style>
  .game-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 104px 24px 56px;
    box-sizing: border-box;
  }

  .game-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 1.5rem 2rem;
    background: linear-gradient(135deg, rgba(10, 235, 0, 0.08) 0%, rgba(10, 235, 0, 0.03) 100%);
    border: 1px solid rgba(10, 235, 0, 0.2);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    text-align: center;
  }

  .game-header h1 {
    margin: 0;
    font-size: 2.2rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -2px;
    text-transform: uppercase;
    text-shadow: 0 0 30px rgba(10, 235, 0, 0.3);
  }

  .game-header h2 {
    margin: 0;
    color: #ff4d4d;
    font-size: 1rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .game-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
  }

  @media (max-width: 640px) {
    .game-page {
      padding: 96px 16px 80px;
    }

    .game-header {
      padding: 1.25rem 1rem;
    }

    .game-header h1 {
      font-size: 1.8rem;
      letter-spacing: -1px;
    }

    .game-header h2 {
      font-size: 0.9rem;
    }
  }
</style>