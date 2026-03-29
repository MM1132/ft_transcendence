<script>
  import FriendsForm from "../components/FriendsForm.svelte";
  import RoomsForm from "../components/RoomsForm.svelte";
  import ChatForm from "../components/ChatForm.svelte";

  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { authStore } from "../stores/authStore";
  import { avatarStore } from "../stores/avatarStore";
  import { connect, roomState } from "../stores/roomStore.svelte";

  let isChatExpanded = $state(true);

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

    <section class="dashboard-center-card" aria-label="Profile summary">
      <div class="center-avatar-wrap">
        {#if $avatarStore}
          <img class="center-avatar" src={$avatarStore} alt="User avatar" />
        {:else}
          <div class="center-avatar center-avatar-placeholder" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        {/if}
      </div>
      <div class="center-balance-card">
        <p class="center-label">Balance</p>
        <p class="center-balance">{$authStore.balance ?? 0}</p>
      </div>
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
  top: 240px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  z-index: 900;
}

.center-avatar-wrap {
  display: flex;
  justify-content: center;
}

.center-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0AEB00;
  background: rgba(255, 255, 255, 0.05);
}

.center-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(10, 235, 0, 0.7);
}

.center-avatar-placeholder svg {
  width: 72px;
  height: 72px;
}

.center-label,
.center-balance {
  margin: 0;
}

.center-balance-card {
  min-width: 220px;
  padding: 18px 22px;
  box-sizing: border-box;
  border: 1px solid rgba(10, 235, 0, 0.16);
  background: rgba(15, 19, 20, 0.82);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.center-label {
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.9rem;
}

.center-balance {
  color: #0AEB00;
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1;
}

@media (max-width: 1480px) {
  .dashboard-center-card {
    display: none;
  }
}

</style>
