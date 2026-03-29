<script>
  import Sidebar from "../components/Sidebar-room.svelte";
  import Game from "../components/Game.svelte";
  let isSidebarExpanded = true;
</script>

<main>
  <div class="dashboard-layout">
    <Sidebar bind:isExpanded= {isSidebarExpanded}/>
    <Game sidebarExpanded={isSidebarExpanded}/>
  </div>
</main>

<style>
.dashboard-layout
{
  position: relative;
  min-height: 100vh;
}


</style>