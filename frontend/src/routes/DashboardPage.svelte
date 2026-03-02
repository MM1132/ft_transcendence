<script>
  import FriendsForm from "../components/FriendsForm.svelte";
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
  <div class="friends-layout">
    <FriendsForm />
  </div>
</main>

<footer>
<div id="footer">
  <p>&copy; 2026 ft_trancendence. All rights reserved.</p>
</div>
</footer>

<style>
  main
  {
    padding: 110px 24px 56px;
  }

  .friends-layout
  {
    width: 100%;
    min-height: 72vh;
    position: relative;
  }
</style>
