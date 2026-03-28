<script lang="ts">
  import { roomState } from '../../stores/roomStore.svelte';
  import MultiplayerSnakeBoard from './MultiplayerSnakeBoard.svelte';

  const gameState = $derived(roomState.gameState);
  const players = $derived(roomState.currentRoomPlayers ?? []);

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
</script>

<div class="room-game-shell">
  <div class="room-game-header">
    <h2>Room Match</h2>
    <p>Status: <strong>{roomState.gameStatus ?? 'idle'}</strong></p>
  </div>

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
</style>