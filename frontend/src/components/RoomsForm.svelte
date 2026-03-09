<script lang="ts">
    import { onMount } from 'svelte';
    import { getAllRooms } from '../services/roomService.svelte.ts';
    import RoomCard from './Roomcard.svelte';
    import Button from './Button.svelte';

    let isExpanded = $state(false);
    let allRooms = $state<Room[]>([]);

    function togglePanel()
    {
        isExpanded = !isExpanded;
    }

    function refresh()
    {
        getAllRooms().then((rooms)=> {allRooms = rooms;})
    }

    onMount(() => 
    {
        refresh();
        const interval = setInterval(refresh, 5000);
        return () => clearInterval(interval);

    });
</script>

<aside class="rooms-drawer" class:expanded={isExpanded}>
    <Button
        type="button"
        variant="expand-trigger-right"
        onclick={togglePanel}
        ariaExpanded={isExpanded}
        ariaLabel={isExpanded ? 'Close rooms panel' : 'Open rooms panel'}
    >
        ROOMS
    </Button>
    
    {#if isExpanded}
        <div class="rooms-panel">
            <h2>Rooms</h2>
            {#each allRooms as room (room.id)}
                <RoomCard {room}></RoomCard>
            {/each}
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
        overflow: hidden;
        transition: width 0.3s ease;
    }

    .rooms-drawer.expanded
    {
        width: max(320px, 33.333vw);
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
    }

    .rooms-panel:hover
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
