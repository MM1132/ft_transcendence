<script>
  import Button from '../components/Button.svelte';
  import SettingsForm from "../components/SettingsForm.svelte";
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
  <div class="settings-layout">
    <SettingsForm />
    <div class="settings-actions">
      <Button type="button">Save</Button>
    </div>
  </div>
</main>

<footer>
<div id="footer">
  <p>&copy; 2026 ft_trancendence. All rights reserved.</p>
</div>
</footer>

<style>
  .settings-layout
  {
    width: 100%;
  }

  .settings-actions
  {
    padding: 10px 0px 0px;
  }
  main
  {
    min-height: 100vh;
    padding: 110px 24px 56px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
</style>
