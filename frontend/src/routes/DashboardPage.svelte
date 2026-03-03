<script>
  import { onMount } from "svelte";

  function logout()
  {
    window.location.href = '/';
    console.log("Logout clicked");
  }

  onMount(() => {
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', () => {
      history.pushState(null, '', location.href);
    });
  });
</script>

<div class="button-container">
  <button type="button" on:click={logout}>Logout</button>
</div>

<style>
.button-container
{
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>