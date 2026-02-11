<div id="settings-form">
    <form class="settings-content">
        <h2>SETTINGS</h2>
        <p style="opacity: 0.7;">Hier noch Settings rein.</p>
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
