<script lang="ts">
    import Button from "./Button.svelte";
    let { room, onJoin, onDelete = () => {} } = $props();


    const isFull = $derived(room.current_players === room.max_players);
    const fillPercent = $derived((room.current_players / room.max_players) * 100);

</script>



<!-- <pre>{JSON.stringify(room, null, 2)}</pre> -->
<div class="room-card" class:full={isFull}>
    <button
        type="button"
        class="delete-room-button"
        aria-label={`Delete room ${room.name}`}
        onclick={onDelete}
    >
        X
    </button>
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
        position: relative;
        padding: 26px;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.6);
        margin-bottom: 1rem;
    }

    .delete-room-button
    {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 15px;
        height: 15px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(255, 255, 255, 0.04);
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        line-height: 2;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
    }

    .delete-room-button:hover
    {
        border-color: #ff4444;
        color: #ff4444;
        background: rgba(255, 68, 68, 0.08);
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
