<script lang="ts">
    import Button from './Button.svelte';

    let isExpanded = $state(false);

    function togglePanel()
    {
        isExpanded = !isExpanded;
    }
</script>

<aside class="rooms-drawer" class:expanded={isExpanded}>
    <Button
        type="button"
        variant="expand-trigger-right"
        onclick={togglePanel}
        ariaExpanded={isExpanded}
        ariaLabel={isExpanded ? 'Close rooms panel' : 'Open rooms panel'}
    >
        ROOMS
    </Button>

    {#if isExpanded}
        <form class="rooms-panel">
            <h2>Rooms</h2>
        </form>
    {/if}
</aside>

<style>
    .rooms-drawer
    {
        position: fixed;
        right: 0;
        top: 100px;
        bottom: 60px;
        width: 50px;
        overflow: hidden;
        transition: width 0.3s ease;
    }

    .rooms-drawer.expanded
    {
        width: max(320px, 33.333vw);
    }

    .rooms-panel
    {
        margin-right: 55px;
        height: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        padding: 36px;
    }

    .rooms-panel:hover
    {
        border-color: #0AEB00;
        background: rgba(10, 235, 0, 0.02);
    }

    h2
    {
        margin: 0 0 14px;
        color: #0AEB00;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-align: left;
    }
</style>
