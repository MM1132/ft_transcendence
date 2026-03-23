<script lang="ts">
    import { roomState, send } from "../stores/roomStore.svelte";
    import Button from "../components/Button.svelte";

    export let roomId: string;

      // i will delete it later
    function handleLeaveRoom()
    {
        send('room:leave', { room_id: roomId });
    }
</script>

<main>
<div class="room">
    <h1>Room Page</h1>
    <p>Room ID: {roomId}</p>

    <!-- {#if roomState.currentRoomId} -->
      <div class="leave-room-container">
        <Button onclick={handleLeaveRoom} class="leave-room-btn">Leave Room</Button>
      </div>
    <!-- {/if} -->
</div>
</main>

<style>
    .room
    {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color :beige;
    }

    .leave-room-container
    {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    }
</style>