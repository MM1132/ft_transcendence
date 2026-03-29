<script lang="ts">
  import { onMount } from 'svelte';
  import { roomState, send, type Direction } from '../../stores/roomStore.svelte';
  import MultiplayerSnakeBoard from './MultiplayerSnakeBoard.svelte';

  const gameState = $derived(roomState.gameState);
  const players = $derived(roomState.currentRoomPlayers ?? []);

  const lastGameResult = $derived(roomState.lastGameResult ?? null);

  const winnerName = $derived.by(() => {
    if (!lastGameResult?.winner_id) return null;
    const winner = players.find((p) => p.id === lastGameResult.winner_id);
    return winner?.username ?? lastGameResult.winner_id;
  });

  const slotEntries = $derived.by(() => {
    if (!gameState) return [];

    return Object.entries(gameState.snakes)
      .map(([slot, snake]) => ({
        slot: Number(slot),
        snake,
        player: players.find((p) => p.slot === Number(slot)) ?? null
      }))
      .sort((a, b) => a.slot - b.slot);
  });

  onMount(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (!roomState.gameState) return;
      if (roomState.gameStatus !== 'running') return;
      if (event.repeat) return;

      let direction: Direction | null = null;

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          direction = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'right';
          break;
      }

      if (!direction) return;

      event.preventDefault();
      send('game:input', { direction });
    }

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="room-game-shell">
  <div class="room-game-header">
    <h2>Room Match</h2>
    <p>Status: <strong>{roomState.gameStatus ?? 'idle'}</strong></p>
  </div>

  Then add a result banner above the boards

Inside the markup, after the header:

  {#if roomState.gameStatus === 'ended' && lastGameResult}
    <div class="result-banner">
      <h3>Game Over</h3>
      <p>
        Winner:
        <strong>{winnerName ?? 'No winner'}</strong>
      </p>

      <ul>
        {#each Object.entries(lastGameResult.scores) as [slot, score]}
          <li>slot {slot}: {score}</li>
        {/each}
      </ul>

      <p>Ready up again to start a new round.</p>
    </div>
  {/if}

  {#if !roomState.currentRoom}
    <div class="room-game-empty">
      <p>No active room selected.</p>
    </div>
  {:else if !gameState}
    <div class="room-game-empty">
      <p>Waiting for match snapshots...</p>
      <p>Join, ready up, and start the game.</p>
    </div>
  {:else}
    <div class="boards-grid">
      {#each slotEntries as entry (entry.slot)}
        <MultiplayerSnakeBoard
          width={gameState.box_width}
          height={gameState.box_height}
          snake={entry.snake}
          apple={gameState.apple}
          title={entry.player ? `${entry.player.username} (slot ${entry.slot})` : `slot ${entry.slot}`}
          isCurrentPlayer={entry.player?.id === roomState.currentUserId}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .room-game-shell {
    position: fixed;
    top: 100px;
    bottom: 60px;
    left: 10px;
    width: calc(100vw - 490px);
    background: rgb(15, 19, 20);
    border: 1px solid rgba(10, 235, 0, 0.1);
    display: flex;
    flex-direction: column;
    padding: 24px;
    box-sizing: border-box;
    gap: 16px;
    overflow: auto;
  }

  .room-game-header h2,
  .room-game-header p {
    margin: 0;
  }

  .room-game-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0.85;
    text-align: center;
  }

  .boards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .result-banner {
    border: 1px solid rgba(10, 235, 0, 0.25);
    padding: 12px 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
  }

  .result-banner h3,
  .result-banner p,
  .result-banner ul {
    margin: 0 0 8px 0;
  }

  .result-banner ul {
    list-style: none;
    padding: 0;
  }
</style>