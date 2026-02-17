<script>
    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";

    let { children } = $props();
</script>

<Header />
<main>
    <slot />
</main>
<Footer />