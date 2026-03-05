<script>
  import FriendsForm from "../components/FriendsForm.svelte";
  import RoomsForm from "../components/RoomsForm.svelte";
  import ChatForm from "../components/ChatForm.svelte";
</script>

<header>
  <div id="header">
    <div class="header-logo">
      <img src="src/images/c.svg" alt="Logo"/>
    </div>
     <div class="header-nav">
      <a href="#/">LOGIN</a>
    </div>
  </div>
</header>

<main>
  <div class="dashboard-layout">
    <div class="profile-circle">Profile<br /> pic</div>
    <FriendsForm />
    <RoomsForm />
    <ChatForm />
  </div>
</main>

<footer>
<div id="footer">
  <p>&copy; 2026 ft_trancendence. All rights reserved.</p>
</div>
</footer>

<style>
.dashboard-layout {
  position: relative;
  min-height: 100vh;
}

.profile-circle {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 2px solid #0AEB00;
  background: rgba(15, 19, 20, 0.6);
  color: #0AEB00;
}
/* den style braucht man nur fuer profil pic */
</style>
