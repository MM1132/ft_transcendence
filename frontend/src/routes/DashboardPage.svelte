<script>
  import FriendsForm from "../components/FriendsForm.svelte";
  import RoomsForm from "../components/RoomsForm.svelte";
  import ChatForm from "../components/ChatForm.svelte";
  // Removed Header/Footer coz are provided by Layout, so dashboard only renders page content.
</script>

<main>
  <div class="dashboard-layout">
    <FriendsForm />
    <RoomsForm />
    <ChatForm />
  </div>
</main>

<style>
.dashboard-layout {
  position: relative;
  min-height: 100vh;
}
</style>
