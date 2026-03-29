<script lang="ts">
    import { roomState, send } from '../stores/roomStore.svelte';
    import Button from './Button.svelte';

    let isActiveReady = $state(false);
    let kickedPlayerId = $state(null);
    let { isExpanded = $bindable(true) } = $props();

    function handleLeaveRoom()
    {
        if (roomState.currentRoomId)
        {
            // we send the ID as a Number to match backend expectations
            send('room:leave', { room_id: Number(roomState.currentRoomId) });
        }
    }

    function handlePlayerReady()
    {
        isActiveReady = !isActiveReady;
        console.log('Sending room:ready for room', roomState.currentRoomId);
        send('room:ready', { room_id: Number(roomState.currentRoomId) });
    }

    function handleKickPlayer(id: string)
    {
        if (kickedPlayerId === id)
        {
            kickedPlayerId = null; // Toggle off if clicking the same one
        }
        else
        {
            kickedPlayerId = id; // Toggle on
        }
        console.log(`Kicking player ${id} from room ${roomState.currentRoomId}`);
        send('room:kick', { room_id: Number(roomState.currentRoomId), target_user_id: id });
    }

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
    >
        INFO
    </Button>
    
    {#if isExpanded}
    <div class="rooms-panel">
        <div class="rooms-header">
            <h2>Room: <span class="room-name"> {roomState.currentRoom.name}</span></h2>
        </div>
        <span class="capacity">CAPACITY: {roomState.currentRoomPlayers.length} / {roomState.currentRoom.max_players}</span>

        <div class="progress-container">
            <div class="progress-bar" style="width: {(roomState.currentRoomPlayers.length / roomState.currentRoom.max_players) * 100}%"></div>
        </div>

        <div class="player-list">
            {#each roomState.currentRoomPlayers as player}
                <div class="player-card" class:active={player.is_ready}>
                    <div class="player-info">
                        <div class="details">
                            <span class="username">{player.username}</span>
                        </div>
                    </div>
                    <div class="status-tag" class:is-ready={player.is_ready}>
                        {player.is_ready ? "READY" : "NOT_READY"}
                    </div>
                    <!-- can not the other users kick the creator &&  not visible for the creator the button-->
                    {#if roomState.currentRoom && roomState.currentRoom.creator_id === roomState.currentUserId && player.id !== roomState.currentUserId}
                    <Button class={kickedPlayerId === player.id ? "active" : ""} variant="kick" onclick={() => handleKickPlayer(player.id)}>KICK</Button>
                    {/if}
                </div>
            {/each}
        </div>

        <div class="action-footer">
            <Button class={"btn-ready" + (isActiveReady ? " active" : "")} onclick={handlePlayerReady} variant="ready"> READY </Button>
            <Button class="btn-leave" variant="cancel" onclick={handleLeaveRoom}>LEAVE</Button>
        </div>
    </div>
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
        transition: width 0.3s ease;
    }
    
    
    
    .rooms-drawer.expanded
    {
        /* width: max(460px, calc(33.333vw)); */
        width: 460px;
    }

    .rooms-panel
    {
        margin-right: 55px;
        height: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(10, 235, 0, 0.1);
        backdrop-filter: blur(100px);
        padding: 36px;
        flex-direction: column;
        display: flex;
        background: rgb(15, 19, 20);
        /*its better*/
        /* background: #0b0e0f; */
        color: #e0e0e0;
    }
    
    .rooms-panel:hover
    {
        border-color: #0AEB00;
        background: rgba(10, 235, 0, 0.01);
    }

    .rooms-header
    {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
        letter-spacing: 1px;
    }

    h2
    {
        color: #0AEB00;
    }

   .room-name
    {
        /* border: 0.4px solid #B13BCC; */
        color: #fff;
        padding: 2px 10px;
        font-size: 0.6em;
        font-weight: bold;
    }

    .capacity
    {
        font-size: 0.7rem;
        color: #888;
        letter-spacing: 1px;
        text-align: left;
    }

    .progress-container
    {
        height: 4px;
        background: #1a1a1a;
        margin: 15px 0 25px;
    }

    .progress-bar
    {
        height: 100%;
        background: #B13BCC;
    }

    .player-card
    {
        padding: 22px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid rgba(10, 235, 0, 0.1);
        /* background: rgba(15, 19, 20, 20); */
        background: #121617;
    }



    .player-list
    {
        flex-grow: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }


    .player-card.active
    {
        /* border-color: #222; */
        border-color: #0AEB00;
    }

    .player-info
    {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .username
    {
        display: block;
        font-weight: bold;
        font-size: 0.9rem;
    }
    
    .status-tag
    {
        font-size: 0.7rem;
        font-weight: bold;
        color: #444;
        margin-top: 5px;
    }

    .status-tag.is-ready
    {
        color: #B13BCC;
    }
    
    .action-footer
    {
        margin-bottom: 16px;
        display: flex;
        gap: 16px;
    }
</style>

