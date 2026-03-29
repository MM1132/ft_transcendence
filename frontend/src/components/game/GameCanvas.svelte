 <!-- bridge component as to create <canvas> </canvas> 
  on mount: call initGame(canvas, options)
  on destroy: stop the loop, remove listeners-->

<!-- bridge between Svelte and the JS engine -->

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

<!-- this component may also wrap the canvas in a container
as to help with styling and responsive sizing later. -->
<!-- Create this element, then put its reference into my canvas variable -->
<div class="game-canvas-shell">
  <canvas bind:this={canvas} class="game-canvas"></canvas>
</div>

<style>
  .game-canvas-shell {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .game-canvas {
    display: block;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    background: #111827;
    max-width: 100%;
    height: auto;
  }
</style>
