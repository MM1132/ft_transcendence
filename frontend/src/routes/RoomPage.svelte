<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { authStore } from '../stores/authStore';
  import { connect, roomState, send } from '../stores/roomStore.svelte';
  import Sidebar from "../components/Sidebar-room.svelte";
  import RoomMultiplayerGame from "../components/game/RoomMultiplayerGame.svelte";

  let { roomId } = $props<{ roomId: string }>();
  let hasRequestedJoin = $state(false);

  onMount(() => {
    const session = get(authStore);
    if (session.sessionToken && !roomState.isConnected) {
      connect(session.sessionToken);
    }
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
</script>

<main>
  <div class="dashboard-layout">
    <Sidebar />
    <RoomMultiplayerGame />
  </div>
</main>

<style>
.dashboard-layout
{
  position: relative;
  min-height: 100vh;
}
</style>