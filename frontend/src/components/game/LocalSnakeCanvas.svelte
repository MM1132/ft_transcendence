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
  }

  .game-canvas {
    display: block;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    background: #111827;
    max-width: 100%;
    height: auto;
    width: min(100%, 1080px);
  }
</style>