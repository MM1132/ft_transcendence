<script>
    import LoginForm from "../components/LoginForm.svelte";

    function handleLogin({ username, password })
    {
        console.log('Login attempt:', username, password);
        // TODO: Call API to authenticate
    }
</script>

<header>
  <div id="header">
    <div class="header-logo">
      <img src="src/images/c.svg" alt="Logo"/>
    </div>
     <div class="header-nav">
      <a href="#leaderboard">LEADERBOARD</a>
      <a href="#settings">SETTINGS</a>
    </div>
  </div>
</header>

<main>
    <LoginForm onLogin={handleLogin} />
</main>

<footer>
<div id="footer">
  <p>&copy; 2026 ft_trancendence. All rights reserved.</p>
</div>
</footer>
