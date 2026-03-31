<script lang="ts">
  import { onMount } from 'svelte';
  import { roomState, send, type Direction } from '../../stores/roomStore.svelte';
  import MultiplayerSnakeBoard from './MultiplayerSnakeBoard.svelte';

  const gameState = $derived(roomState.gameState);
  const players = $derived(roomState.currentRoomPlayers ?? []);
  const lastGameResult = $derived(roomState.lastGameResult ?? null);
  const gameStatusLabel = $derived(roomState.gameStatus ?? 'idle');
  const winningPlayer = $derived(
    lastGameResult?.winner_id
      ? players.find((player) => player.id === lastGameResult.winner_id) ?? null
      : null
  );
  const winningBalanceGain = $derived(
    lastGameResult?.winner_id
      ? (lastGameResult.coins_change[lastGameResult.winner_id] ?? 0)
      : 0
  );

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
    <p>Status: <strong class={`status-${gameStatusLabel}`}>{gameStatusLabel}</strong></p>
  </div>

  {#if roomState.gameStatus === 'ended' && winningPlayer && winningBalanceGain > 0}
    <div class="winner-banner">
      {winningPlayer.username} won and gained {winningBalanceGain} balance
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
          title={entry.player ? entry.player.username : `Player ${entry.slot}`}
          isCurrentPlayer={entry.player?.id === roomState.currentUserId}
          isEliminated={roomState.gameStatus === 'ended' && !!lastGameResult?.winner_id && entry.player?.id !== lastGameResult.winner_id}
          showGameOver={roomState.gameStatus === 'ended' && !!lastGameResult?.winner_id && entry.player?.id === roomState.currentUserId && entry.player?.id !== lastGameResult.winner_id}
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

  .room-game-header h2 {
    color: #0aeb00;
  }

  .room-game-header p {
    color: rgba(255, 255, 255, 0.78);
  }

  .room-game-header strong {
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .room-game-header .status-idle {
    color: #cbd5e1;
  }

  .room-game-header .status-running {
    color: #0aeb00;
  }

  .room-game-header .status-ended {
    color: #f87171;
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

  .winner-banner {
    padding: 12px 16px;
    border: 1px solid rgba(10, 235, 0, 0.25);
    background: rgba(10, 235, 0, 0.08);
    color: #0aeb00;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .boards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
</style>
