<script>
  import { onMount } from 'svelte';
  import { initGame } from '../../game/index.js';

  let canvas;
  let cleanup = null;

  onMount(() => {
    cleanup = initGame(canvas, {
      debug: false
    });

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  });
</script>

<div class="game-canvas-shell">
  <canvas bind:this={canvas} class="game-canvas"></canvas>
</div>

<style>
  .game-canvas-shell {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex: 1;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .game-canvas {
    display: block;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    background: #111827;
    max-width: 100%;
    max-height: 100%;
    width: clamp(300px, 90vw, 1080px);
    height: auto;
    aspect-ratio: 1;
  }

  @media (max-width: 768px) {
    .game-canvas-shell {
      padding: 0 12px;
    }

    .game-canvas {
      width: clamp(280px, 85vw, 800px);
    }
  }

  @media (max-width: 480px) {
    .game-canvas {
      width: clamp(250px, 90vw, 600px);
    }
  }
</style>