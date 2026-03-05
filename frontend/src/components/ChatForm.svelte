<script lang="ts">
    import Button from './Button.svelte';

    let isExpanded = $state(false);

    function togglePanel()
    {
        isExpanded = !isExpanded;
    }
</script>

<aside class="chat-drawer" class:expanded={isExpanded}>
    <Button
        type="button"
        variant="expand-trigger-bottom"
        onclick={togglePanel}
        ariaExpanded={isExpanded}
        ariaLabel={isExpanded ? 'Close chat panel' : 'Open chat panel'}
    >
        CHAT
    </Button>

    {#if isExpanded}
        <form class="chat-panel">
            <h2>Chat</h2>
        </form>
    {/if}
</aside>

<style>
    .chat-drawer
    {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 40px;
        width: max(320px, 33.333vw);
        height: 56px;
        overflow: hidden;
        transition: height 0.3s ease;
    }

    .chat-drawer.expanded
    {
        height: max(240px, 45vh);
    }

    .chat-panel
    {
        margin-bottom: 55px;
        height: calc(100% - 55px);
        width: calc(100% - 16px);
        margin-left: 8px;
        margin-right: 8px;
        box-sizing: border-box;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        padding: 24px 28px;
    }

    .chat-panel:hover
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
