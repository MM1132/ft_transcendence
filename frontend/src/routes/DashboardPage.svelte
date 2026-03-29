<script>
  import FriendsForm from "../components/FriendsForm.svelte";
  import RoomsForm from "../components/RoomsForm.svelte";
  import ChatForm from "../components/ChatForm.svelte";

  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { authStore } from "../stores/authStore";
  import { connect, roomState } from "../stores/roomStore.svelte";

  let isChatExpanded = $state(true);
  const activePlayersCount = $derived(
    roomState.rooms.reduce((total, room) => total + (room.current_players ?? 0), 0)
  );

  function formatPlayerCount(value) {
    return String(Number(value) || 0);
  }

  onMount(() => {
    const session = get(authStore);
    if (session.sessionToken && !roomState.isConnected)
    {
      connect(session.sessionToken);
      console.log("Connecting with token:", session.sessionToken);
    }
  });
</script>

<main>
  <div class="dashboard-layout">
    <FriendsForm chatExpanded={isChatExpanded} />
    <RoomsForm chatExpanded={isChatExpanded} />
    <ChatForm bind:isExpanded={isChatExpanded} />

    <section class="dashboard-center-card" aria-label="Live player count">
      <p class="center-eyebrow">Live Now</p>
      <p class="center-count">{formatPlayerCount(activePlayersCount)}</p>
      <p class="center-copy">
        {activePlayersCount === 1 ? 'player is playing right now' : 'players are playing right now'}
      </p>
    </section>
  </div>
</main>

<style>
.dashboard-layout {
  position: relative;
  min-height: 100vh;
}

.dashboard-center-card {
  position: fixed;
  top: 280px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  padding: 26px 24px;
  box-sizing: border-box;
  border: 1px solid rgba(10, 235, 0, 0.16);
  background: rgba(15, 19, 20, 0.82);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 900;
}

.center-eyebrow,
.center-count,
.center-copy {
  margin: 0;
}

.center-eyebrow {
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.9rem;
}

.center-count {
  color: #0AEB00;
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.08em;
  font-variant-numeric: tabular-nums;
}

.center-copy {
  color: rgba(255, 255, 255, 0.86);
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  max-width: 220px;
}

@media (max-width: 1480px) {
  .dashboard-center-card {
    display: none;
  }
}

</style>
