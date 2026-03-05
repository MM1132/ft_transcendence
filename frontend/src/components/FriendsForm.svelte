<script lang="ts">
    import Button from './Button.svelte';

    let isExpanded = $state(true);

    function togglePanel()
    {
        isExpanded = !isExpanded;
    }
</script>

<aside class="friends-drawer" class:expanded={isExpanded}>
    <Button
        type="button"
        variant="expand-trigger-left"
        onclick={togglePanel}
        ariaExpanded={isExpanded}
        ariaLabel={isExpanded ? 'Close friends panel' : 'Open friends panel'}
    >
        FRIENDS
    </Button>

    {#if isExpanded}
        <form class="friends-panel">
            <h2>Friends</h2>
        </form>
    {/if}
</aside> 
<!-- aside ist container fuer ergaenzende inhalte -->

<style>
    .friends-drawer
    {
        position: fixed;
        left: 0;
        top: 100px;
        bottom: 60px; /* 40 weniger als top, weil header 40px groeser ist als footer*/
        width: 50px;
        overflow: hidden; 
        /* schneidet alles raus was aus drawer rausstehen wuerde */
        transition: width 0.3s ease;
    }

    .friends-drawer.expanded
    {
        width: max(320px, 33.333vw);
        /* 1/3 vom bildschirm (33%) und mingroese von 320px fuer kleine bildschirme */
    }


    .friends-panel
    {
        margin-left: 55px;
        height: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        padding: 36px;
    }

    .friends-panel:hover
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
