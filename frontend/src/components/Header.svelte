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
    </div>
  </div>
</header>




<main>
  <div class="settings-layout">
    <SettingsForm />
    <div class="settings-actions">
      <Button type="submit" form="settings-form-main" variant="save">Save</Button>
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
    display: flex;
    flex-direction: row;
    gap: 20px;
  }

  .settings-actions
  {
    width: 150px;
    display: flex;
    /* flex-direction: column-reverse; */
  }

  main
  {
    padding: 110px 24px 56px;
  }
</style>
