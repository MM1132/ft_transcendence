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
    gap: 1.5rem;
    padding: 2rem;
    box-sizing: border-box;
  }

  .game-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: -1rem;
    padding: 7rem 2rem;
    background: linear-gradient(135deg, rgba(10, 235, 0, 0.08) 0%, rgba(10, 235, 0, 0.03) 100%);
    border: 1px solid rgba(10, 235, 0, 0.2);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    text-align: center;
  }

  .game-header h1 {
    margin: 0;
    font-size: 3rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -2px;
    text-transform: uppercase;
    text-shadow: 0 0 30px rgba(10, 235, 0, 0.3);
  }

  .game-header p {
    margin: 0;
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.2rem;
    letter-spacing: 1px;
  }

  .game-layout {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>