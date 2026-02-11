<script lang="ts">
    import ToggleSetting from './Toggle.svelte';

    let twoFactorEnabled = $state(false);
    let notificationsEnabled = $state(true);
    let testToggles = $state(
        Array.from({ length: 14 }, (_, index) => ({
            id: index + 1,
            label: `Test Setting ${index + 1}`,
            checked: index % 2 === 0
        }))
    );
</script>

<div id="settings-form">
    <form class="settings-content">
        <h2>SETTINGS</h2>
        <ToggleSetting label="very long text blablabla balbalblablablablablabla hmmmmmmmmm still not long enough, what do i do here ahhhhhhhhhhhhhhhhhhhh now we hit the 2nd line, looks weird.... whatever" />
        <ToggleSetting label="Two Factor Authentication" bind:checked={twoFactorEnabled} />
        <ToggleSetting label="Notifications" bind:checked={notificationsEnabled} />
        {#each testToggles as toggle (toggle.id)}
            <ToggleSetting label={toggle.label} bind:checked={toggle.checked} />
        {/each}
    </form>
</div>

<style>
    #settings-form
    {
        width: min(1500px, 90vw);
        height: min(80vh, 1100px);
        border: 1px solid rgba(10, 235, 0, 0.1);
        border-radius: 0px;
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        transition: all 0.3s;
        box-sizing: border-box;
  }

    #settings-form:hover
    {
    border-color: #0AEB00;
    background: rgba(10, 235, 0, 0.02);
    transform: translateY(-5px);
    }

    h2
    {
    align-self: flex-start;
    margin: 0;
    color: #0AEB00;
    text-transform: uppercase;
    letter-spacing: 1px;
    }

    .settings-content
    {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 40px;
    box-sizing: border-box;
    overflow-y: auto;
    }

</style>
