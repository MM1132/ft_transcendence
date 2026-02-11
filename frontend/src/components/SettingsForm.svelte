<div id="settings-form">
    <form>
        <h2>SETTINGS</h2>
        <p style="opacity: 0.7;">Hier noch Settings rein.</p>
    </form>
</div>

<style>
    #settings-form
    {
        width: 90vw;
        height: 75vh;
        max-width: 1500px;
        max-height: 850px;
        border: 1px solid rgba(10, 235, 0, 0.1);
        border-radius: 0px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -45%);
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        transition: all 0.3s;
  }

    #settings-form:hover
    {
    border-color: #0AEB00;
    background: rgba(10, 235, 0, 0.02);
    transform: translate(-50%, -45%) translateY(-5px);
    }

    h2
    {
    align-self: flex-start;
    margin: 0;
    color: #0AEB00;
    text-transform: uppercase;
    letter-spacing: 1px;
    }

    #settings-form form
    {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 40px;
    }

</style>
