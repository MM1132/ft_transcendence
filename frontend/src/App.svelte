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
  <h1 id="status">{moodStatus}</h1>
  <div id="square"></div>
  <button id="mood-btn" on:click={handleMoodClick}>Change Mood</button> 
</main>


<footer>
<div id="footer"> </div>
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
