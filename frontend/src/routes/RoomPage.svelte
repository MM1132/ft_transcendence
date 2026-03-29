<script>
  import Sidebar from "../components/Sidebar-room.svelte";
  import RoomMultiplayerGame from "../components/game/RoomMultiplayerGame.svelte";
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