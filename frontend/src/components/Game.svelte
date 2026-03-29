<script lang="ts">
export let sidebarExpanded: boolean = true;
</script>

<!-- TODO this component will become:
room-mode snapshot renderer
box layout renderer
not the local game engine -->



<div class="game-container">
    <h1>Game Area</h1>
</div>

<style>
.game-container
{
    position: fixed;
    top: 100px;
    bottom: 60px;
    left: 10px;
    width: calc(100vw - 490px);
    background: rgb(15, 19, 20);
    border: 1px solid rgba(10, 235, 0, 0.1);
    /* Optional: center content */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.game-container.collapsed
{
    width: calc(100vw - 70px);
}
</style>
