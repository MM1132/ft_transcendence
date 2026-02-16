<script>
  import Layout from "../components/Layout.svelte";
  import Button from "../components/Button.svelte";
  import { onMount } from "svelte";

   onMount(() => {
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', () => {
      history.pushState(null, '', location.href);
    });
  });

</script>

<Layout>
</Layout>
<Button type="button" on:click={logout}>Logout</Button>