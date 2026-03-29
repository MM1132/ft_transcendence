<script lang="ts">
    import Button from "./Button.svelte";
    let {room, onJoin } = $props();


    const isFull = $derived(room.current_players === room.max_players);
    const fillPercent = $derived((room.current_players / room.max_players) * 100);

</script>



<!-- <pre>{JSON.stringify(room, null, 2)}</pre> -->
<div class="room-card" class:full={isFull}>
    <div class="room-header">
        <div class="room-name">{room.name}</div>
        <span class="fee">{room.buy_in_amount} 💰</span>
    </div>
    <hr class="line" />
    <div class="room-body">
        <div class="players">
            <div class="player-bar">
                <div class="player-fill" style="width:{fillPercent}%"></div>
            </div>
            <span class="player-count">
                {#if isFull}
                FULL
                {:else}
                {room.current_players} / {room.max_players} Players
                {/if}
            </span>
        </div>
        <Button variant="join" type="button" disabled={isFull} onclick={onJoin}>{isFull ? "Full" : "Join"}</Button>
    </div>
</div>

<style>
    .room-header
    {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .room-card
    {
        padding: 26px;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.6);
        margin-bottom: 1rem;
    }

    .room-card:hover
    {
        border-color: #0AEB00;
    }

    .room-name
    {
        /* color:  #B13BCC; */
        color: white;
        font-size: 13px;
        font-weight: 800;
        /* text-align: left; */
    }

    .fee 
    {
        display:block;
        color: #c8eb00;
        font-size: 13px;
        font-weight: 600;
        /* text-align: left; */

    }

    .line
    {
        border: none;
        border-top: 1.5px solid #b13bcc77;
        width:100%;
        /* padding: 4px; */
    }

    
    .room-body
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
    }

    .players
    {
       width: 60%;
        
    }

    .player-bar
    {
        height: 8px;
        background: rgba(255,255,255,0.08);
        margin: 8px;
    }

    .player-fill
    {
        height: 100%;
        background: #0AEB00;
        transition: width 0.3s ease;
    }

   .player-count
    {
        font-size: 13px;
        color: #fff;
        /* font-weight: Bold; */
        /* margin-top: 8px; */
    }

    .room-card.full .player-fill
    {
        background: #ff4444;
    }

    .room-card.full .player-count
    {
        color: #ff4444;
    }
</style>
