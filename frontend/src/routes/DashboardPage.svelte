<script>
  import Layout from "../components/Layout.svelte";
  import Button from "../components/Button.svelte";
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

<Layout>
 <div class="button-container">
    <button type="button" on:click={logout}>Logout</button>
  </div>
</Layout>

<style>
.button-container
{
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>