<script>
  import FriendsForm from "../components/FriendsForm.svelte";
  import RoomsForm from "../components/RoomsForm.svelte";
  import ChatForm from "../components/ChatForm.svelte";

  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { authStore } from "../stores/authStore";
  import { connect, roomState } from "../stores/roomStore.svelte";

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
