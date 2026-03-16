<script>
  import FriendsForm from "../components/FriendsForm.svelte";
  import RoomsForm from "../components/RoomsForm.svelte";
  import ChatForm from "../components/ChatForm.svelte";
</script>


<main>
  <div class="dashboard-layout">
    <div class="profile-circle">Profile<br /> pic</div>
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
