<script lang="ts">
    import { roomState, send } from '../stores/roomStore.svelte';
    import Button from './Button.svelte';

    import { avatarStore } from '../stores/avatarStore';
    const  avatarUrl = $derived(avatarStore);
  
    
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
        console.log('Sending room:ready for room', roomState.currentRoomId);
        send('room:ready', { room_id: Number(roomState.currentRoomId) });
    }

    let isExpanded = $state(true);

    function togglePanel()
    {
        isExpanded = !isExpanded;
    }

</script>

<!-- <aside class="rooms-drawer" class:expanded={isExpanded}>
    <Button
        type="button"
        variant="expand-trigger-right"
        onclick={togglePanel}
        ariaExpanded={isExpanded}
        ariaLabel={isExpanded ? 'Close rooms panel' : 'Open rooms panel'}
    >
        INFO
    </Button>
    
    {#if isExpanded}
    <div class="rooms-panel">
        <div class="rooms-header">
            <h2>Room : <span style="color: #fff;"> {roomState.currentRoom.name} </span> </h2>
        </div>
        <hr class="line" />
        <div class="player-card">
            <div class="divide-card">

                {#each roomState.currentRoomPlayers as player}
                <p style="color: #fff;">{player.username}</p>
                {/each}
            </div>
            <Button onclick={handlePlayerReady} variant={isReady ? "ready" : "noready"}> {isReady ? "Ready" : "Not Ready"} </Button>
        </div>
    </div>
    {/if}
</aside> -->

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
            <div>
                <h2>{roomState.currentRoom.name}</h2>
                <span class="capacity">CAPACITY: {roomState.currentRoomPlayers.length} / {roomState.currentRoom.max_players}</span>
            </div>
        </div>

        <div class="progress-container">
            <div class="progress-bar" style="width: {(roomState.currentRoomPlayers.length / roomState.currentRoom.max_players) * 100}%"></div>
        </div>

        <div class="player-list">
            {#each roomState.currentRoomPlayers as player}
            <div class="player-card">
                <div class="player-info">
                    <div class="avatar-placeholder">
                        {#if avatarUrl}
                                <!-- <img src={avatarUrl} alt="User Avatar" class="avatar-icon" /> -->
                                 <img class="avatar-image" src={$avatarStore} alt="User avatar" />
                        {/if}
                    </div>
                    <div class="details">
                        <span class="username">{player.username}</span>
                        <!-- <span class="rank"> here we can call the level </span> -->
                    </div>
                </div>
                <div class="status-tag" class:is-ready={player.is_ready}>
                    {player.is_ready ? "READY" : "NOT_READY"}
                </div>
            </div>
            {/each}
        </div>

        <!-- <div class="mini-chat">
            <p><span>System:</span> Welcome to the sector.</p>
        </div> -->

        <div class="action-footer">
            <Button onclick={handlePlayerReady} variant="ready-up-large"> READY_UP </Button>
            
            <div class="footer-row">
                <button class="btn-leave" onclick={handleLeaveRoom}> LEAVE </button>
            </div>
        </div>
    </div>
    {/if}
</aside>

<style>
  .avatar-image
    {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }

    .divide-card
    {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .player-card
    {
        padding: 26px;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.6);
        margin-bottom: 1rem;
        /* display: flex;
        align-items: center;
        justify-content: space-between; */
    }

  .line
    {
        border: none;
        border-top: 1.5px solid #b13bcc77;
        width:100%;
        /* padding: 4px; */
    }

    .rooms-drawer
    {
        position: fixed;
        right: 0;
        top: 100px;
        bottom: 60px;
        width: 50px;
        overflow: hidden;
        transition: width 0.3s ease;
    }

    .rooms-drawer.expanded
    {
        /* width: max(320px, calc(33.333vw/1.5)); */
        width: 360px;
    }

    .rooms-panel
    {
        margin-right: 55px;
        height: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        padding: 36px;
        overflow-y: auto;
    }

    .rooms-panel:hover
    {
        border-color: #0AEB00;
        background: rgba(10, 235, 0, 0.02);
    }

    .rooms-header
    {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
    }

    h2
    {
        /* margin: 0 0 14px; */
        color: #0AEB00;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-align: left;
    }





    /* --- Layout Container --- */
    .rooms-drawer {
        position: fixed;
        right: 0;
        top: 100px;
        bottom: 60px;
        width: 50px;
        transition: width 0.3s ease;
        z-index: 100;
    }

   
    .rooms-panel {
        height: 100%;
        background: #0b0e0f; /* Darker background like the image */
        border-left: 1px solid #1a1a1a;
        padding: 20px;
        display: flex;
        flex-direction: column;
        color: #e0e0e0;
    }

    /* --- Header & Progress --- */
    .rooms-header h2 {
        margin: 0;
        font-size: 1.2rem;
        color: white;
    }
    .capacity {
        font-size: 0.7rem;
        color: #888;
        letter-spacing: 1px;
    }

    .progress-container {
        height: 4px;
        background: #1a1a1a;
        margin: 15px 0 25px;
        border-radius: 2px;
    }
    .progress-bar {
        height: 100%;
        background: #B13BCC;
    }

    /* --- Player Cards --- */
    .player-list {
        flex-grow: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .player-card {
        background: #121617;
        padding: 12px;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid transparent;
        transition: border 0.2s;
    }
    .player-card:hover {
        border-color: #222;
    }

    .player-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .avatar-placeholder {
        width: 40px;
        height: 40px;
        background: #2a2a2a;
        border-radius: 4px;
    }

    .username { display: block; font-weight: bold; font-size: 0.9rem; }
    
    .rank { font-size: 0.7rem; color: #555; }

    .status-tag {
        font-size: 0.7rem;
        font-weight: bold;
        color: #444;
    }
    .status-tag.is-ready {
        color: #B13BCC;
    }

    /* --- Footer Buttons --- */
    .action-footer {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    /* You can apply these styles inside your Button component or here */
    :global(.variant-ready-up-large) {
        background: #a892ff !important;
        color: #121212 !important;
        width: 100%;
        padding: 15px !important;
        font-weight: 900 !important;
        border: none !important;
        border-radius: 4px !important;
    }

    .footer-row {
        display: flex;
        gap: 10px;
    }
    .btn-secondary {
        width: 60px;
        background: #161a1b;
        border: 1px solid #222;
    }
    .btn-leave {
        flex-grow: 1;
        background: #9c1a1a;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
    }
</style>

