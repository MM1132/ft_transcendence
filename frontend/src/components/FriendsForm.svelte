<script lang="ts">
    let isExpanded = $state(false);

    function togglePanel()
    {
        isExpanded = !isExpanded;
    }
</script>

<aside class="friends-drawer" class:expanded={isExpanded}>
    <button
        class="friends-trigger"
        type="button"
        onclick={togglePanel}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Close friends panel' : 'Open friends panel'}
    >
        FRIENDS
    </button>

    <section class="friends-panel" aria-hidden={!isExpanded}>
        <h2>Friends</h2>
        <p>Friends form area</p>
    </section>
</aside>

<style>
    .friends-drawer
    {
        position: fixed;
        top: 7vh;
        left: 0px;
        width: 50px;
        height: 90vh;
        background: transparent;
        box-sizing: border-box;
        overflow: hidden;
        transition: width 0.3s ease;
        z-index: 20;
    }

    .friends-drawer.expanded
    {
        width: min(650px, 86vw);
    }

    .friends-trigger
    {
        position: absolute;
        top: 12px;
        left: 8px;
        width: 32px;
        height: calc(100% - 24px);
        border: 0;
        background: #0AEB00;
        color: #062d04;
        cursor: pointer;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1px;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: rotate(180deg);
        border-radius: 1px;
    }

    .friends-panel
    {
        margin-left: 50px;
        width: calc(100% - 50px);
        height: 100%;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        box-sizing: border-box;
        padding: 36px;
        color: #fff;
        opacity: 0;
        transform: translateX(-14px);
        transition: opacity 0.2s ease, transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
        pointer-events: none;
    }

    .friends-drawer.expanded .friends-panel
    {
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
    }

    .friends-drawer.expanded .friends-panel:hover
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

    p
    {
        margin: 0;
        text-align: left;
    }
</style>
