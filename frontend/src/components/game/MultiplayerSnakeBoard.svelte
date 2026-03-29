<!-- draw one isolated box for one player. -->
<script lang="ts">
  import type { SnakePoint, SnakeSnapshot } from '../../stores/roomStore.svelte';

  let {
    width,
    height,
    snake,
    apple,
    title = 'Player',
    isCurrentPlayer = false
  } = $props<{
    width: number;
    height: number;
    snake: SnakeSnapshot | null;
    apple: SnakePoint;
    title?: string;
    isCurrentPlayer?: boolean;
  }>();

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

  .board-grid {
    display: grid;
    gap: 1px;
    background: rgba(255, 255, 255, 0.04);
    aspect-ratio: 1 / 1;
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
</style>