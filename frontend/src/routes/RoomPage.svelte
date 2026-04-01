<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { authStore } from '../stores/authStore';
  import { connect, roomState, send } from '../stores/roomStore.svelte';
  import Sidebar from "../components/Sidebar-room.svelte";
  import RoomMultiplayerGame from "../components/game/RoomMultiplayerGame.svelte";

  let { roomId } = $props<{ roomId: string }>();
  let hasRequestedJoin = $state(false);
  let isSidebarExpanded = $state(true);
  let isCompactViewport = $state(false);

  onMount(() => {
    const session = get(authStore);
    if (session.sessionToken && !roomState.isConnected) {
      connect(session.sessionToken);
    }

    function updateViewportState() {
      isCompactViewport = window.innerWidth <= 1180;
    }

    updateViewportState();
    window.addEventListener('resize', updateViewportState);

    return () => {
      window.removeEventListener('resize', updateViewportState);
    };
  });

  $effect(() => {
    const parsedRoomId = Number(roomId);
    if (
      !hasRequestedJoin &&
      roomState.isConnected &&
      !!roomState.currentUserId &&
      Number.isFinite(parsedRoomId) &&
      parsedRoomId > 0
    ) {
      send('room:join', { room_id: parsedRoomId });
      hasRequestedJoin = true;
    }
  });

  $effect(() => {
    if (!isCompactViewport) {
      return;
    }

    if (roomState.gameStatus === 'running' && isSidebarExpanded) {
      isSidebarExpanded = false;
    } else if (roomState.gameStatus !== 'running' && !isSidebarExpanded) {
      isSidebarExpanded = true;
    }
  });
</script>

<main>
  <div class="dashboard-layout">
    <Sidebar bind:isExpanded={isSidebarExpanded} />
    <RoomMultiplayerGame sidebarExpanded={isSidebarExpanded} />
  </div>
</main>

<style>
.dashboard-layout
{
  position: relative;
  min-height: 100vh;
}
</style>