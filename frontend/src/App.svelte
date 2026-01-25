<header>
  <div id="header">
    <div class="header-logo">
      <img src="src/logo-rm.png" alt="Logo"/>
    </div>
     <div class="header-nav">
      <a href="#leaderboard">Leaderboard</a>
      <a href="#settings">Settings</a>
    </div>
  </div>
</header>

<main>
  <!-- <h1 id="status">{moodStatus}</h1> -->
  <div id="square"></div>
  <!-- <button id="login-btn" on:click={handleMoodClick}>Change Mood</button> -->
  <div id="login-form">
    <input type="text" id="username" placeholder="Username" />
    <input type="text" id="password" placeholder="Password" />
    <button id="login-btn">Login</button>
  </div>
</main>


<footer>
<div id="footer">
  <p>&copy; 2026 ft_trancendence. All rights reserved.</p>
</div>
</footer>

<script>

  let moodStatus = "The mood is calm";
  let isParty = false;

  function handleMoodClick()
  {
    isParty = true;
    moodStatus = "The mood is Party! 🎉";
  }

  function handleOutsideClick(event)
  {
    if (event.target.id !== 'mood-btn')
    {
      isParty = false;
      moodStatus = "The mood is calm";
    }
  }
</script>

<svelte:window on:click={handleOutsideClick} />
