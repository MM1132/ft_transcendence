<!-- draw one isolated box for one player. -->
<script lang="ts">
  import type { SnakePoint, SnakeSnapshot } from '../../stores/roomStore.svelte';

  let {
    width,
    height,
    snake,
    apple,
    title = 'Player',
    isCurrentPlayer = false,
    isEliminated = false,
    showGameOver = false
  } = $props<{
    width: number;
    height: number;
    snake: SnakeSnapshot | null;
    apple: SnakePoint;
    title?: string;
    isCurrentPlayer?: boolean;
    isEliminated?: boolean;
    showGameOver?: boolean;
  }>();

  const isDead = $derived((Boolean(snake) && snake.alive === false) || isEliminated);

  const snakeCells = $derived(
    new Set((snake?.body ?? []).map((p) => `${p.x},${p.y}`))
  );

  const headKey = $derived(
    snake?.body?.[0] ? `${snake.body[0].x},${snake.body[0].y}` : null
  );

  const cells = $derived.by(() => {
    const result: { x: number; y: number; key: string }[] = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        result.push({ x, y, key: `${x},${y}` });
      }
    }

    return result;
  });
</script>

<div class:is-current-player={isCurrentPlayer} class="board-shell">
  <div class="board-header">
    <h3>{title}</h3>
    <p>
      {#if snake}
        score: {snake.score} · {snake.alive ? 'alive' : 'dead'}
      {:else}
        no snake
      {/if}
    </p>
  </div>

  <div class="board-stage" class:is-dead={isDead}>
    <div
      class="board-grid"
      style:grid-template-columns={`repeat(${width}, 1fr)`}
    >
      {#each cells as cell (cell.key)}
        <div
          class="cell"
          class:apple={apple.x === cell.x && apple.y === cell.y}
          class:snake={snakeCells.has(cell.key)}
          class:head={headKey === cell.key}
        />
      {/each}
    </div>

    {#if isDead && (isCurrentPlayer || showGameOver)}
      <div class="death-overlay own">
        <h4>Game Over</h4>
      </div>
    {:else if isDead}
      <div class="death-overlay other"></div>
    {/if}
  </div>
</div>

<style>
  .board-shell {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.02);
  }

  .board-shell.is-current-player {
    border-color: rgba(10, 235, 0, 0.7);
    box-shadow: 0 0 0 1px rgba(10, 235, 0, 0.25);
  }

  .board-header h3,
  .board-header p {
    margin: 0;
  }

  .board-header h3 {
    color: #ffffff;
  }

  .board-header p {
    color: #0aeb00;
  }

  .board-grid {
    display: grid;
    gap: 1px;
    background: rgba(255, 255, 255, 0.04);
    aspect-ratio: 1 / 1;
  }

  .board-stage {
    position: relative;
  }

  .board-stage.is-dead .board-grid {
    filter: saturate(0.35) brightness(0.45);
  }

  .cell {
    background: #111827;
    aspect-ratio: 1 / 1;
  }

  .cell.snake {
    background: #22c55e;
  }

  .cell.head {
    background: #86efac;
  }

  .cell.apple {
    background: #ef4444;
  }

  .death-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    pointer-events: none;
    z-index: 2;
  }

  .death-overlay.own {
    background: rgba(5, 8, 9, 0.5);
  }

  .death-overlay.own h4,
  .overlay-eyebrow {
    margin: 0;
  }

  .death-overlay.own h4 {
    color: #ffffff;
    font-size: clamp(1.8rem, 5vw, 3.5rem);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-shadow: 0 2px 18px rgba(0, 0, 0, 0.5);
  }

  .death-overlay.other {
    background: rgba(5, 8, 9, 0.32);
  }
</style>
