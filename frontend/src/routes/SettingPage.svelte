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
  <SettingsForm />
  <Button type="button">Save</Button>
</main>

<footer>
<div id="footer">
  <p>&copy; 2026 ft_trancendence. All rights reserved.</p>
</div>
</footer>
