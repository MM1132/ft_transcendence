<script lang="ts">
    import { authStore } from "../stores/authStore";
    import { roomState, send } from "../stores/roomStore.svelte";
    import RoomCard from "./Roomcard.svelte";
    import Button from "./Button.svelte";
    import CreateRoomForm from "./CreateRoomForm.svelte";

    let { chatExpanded = false } = $props();

    let isExpanded = $state(true);
    let showCreateModal = $state(false);
    let roomActionError = $state("");
    let createRoomError = $state("");

    let searchQuery = $state("");
    let sortType = $state<"players" | "fee">("players");

    let filteredRooms = $derived(
        roomState.rooms
            .filter((room) =>
                room.name.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .sort((a, b) => {
                if (sortType === "players")
                    return b.current_players - a.current_players;
                if (sortType === "fee")
                    return b.buy_in_amount - a.buy_in_amount;
                return 0;
            }),
    );

    function handleJoin(room: { id: string; buy_in_amount?: number }) {
        if (($authStore.balance ?? 0) < (room.buy_in_amount ?? 0)) {
            roomActionError = "Balance too low to join.";
            return;
        }

        roomActionError = "";
        createRoomError = "";
        send("room:join", { room_id: Number(room.id) });
    }

    function handleCreate(roomData: {
        name: string;
        entryFee: number;
        maxPlayers: number;
    }) {
        if (($authStore.balance ?? 0) < roomData.entryFee) {
            createRoomError = "Balance too low to create.";
            return;
        }

        createRoomError = "";
        roomActionError = "";
        const backendRoomData = {
            name: roomData.name,
            max_players: roomData.maxPlayers,
            buy_in_amount: roomData.entryFee,
            time_limit_seconds: null, // <---------- i need to fix this not hardcoded
            win_condition: "SCORE", // <---------- i need to fix this not hardcoded
            status: "WAITING", // <---------- i need to fix this not hardcoded
            is_permanent: false, // <---------- i need to fix this not hardcoded
        };
        send("room:create", backendRoomData);
        showCreateModal = false;
    }

    function togglePanel() {
        isExpanded = !isExpanded;
    }
</script>

<aside class="rooms-drawer" class:expanded={isExpanded} class:chat-open={chatExpanded} class:modal-open={showCreateModal}>
    <Button
        type="button"
        variant="expand-trigger-right"
        onclick={togglePanel}
        ariaExpanded={isExpanded}
        ariaLabel={isExpanded ? "Close rooms panel" : "Open rooms panel"}
    >
        ROOMS
    </Button>

    {#if showCreateModal}
        <CreateRoomForm
            onClose={() => (showCreateModal = false)}
            onCreate={handleCreate}
            generalError={createRoomError}
        />
    {/if}

    {#if isExpanded}
        <div class="rooms-panel">
            <div class="rooms-header">
                <h2>
                    Rooms : <span class="room-count">
                        {roomState.rooms.length}</span
                    >
                </h2>
                <Button
                    variant="create"
                    type="button"
                    onclick={() => {
                        roomActionError = "";
                        createRoomError = "";
                        showCreateModal = true;
                    }}>+</Button
                >
            </div>
            <div class="filter-toolbar">
                <input
                    type="text"
                    placeholder="  Search..."
                    bind:value={searchQuery}
                    class="search-input"
                />
                <select bind:value={sortType} class="sort-select">
                    <option value="players">Players</option>
                    <option value="fee">Entry Fee</option>
                </select>
            </div>
            {#if roomActionError}
                <p class="room-error-message">{roomActionError}</p>
            {/if}
            {#each filteredRooms as room (room.id)}
                <RoomCard {room} onJoin={() => handleJoin(room)} />
            {:else}
                <p class="no-rooms">No rooms found...</p>
            {/each}
        </div>
    {/if}
</aside>

<style>
    .room-count {
        color: #fff;
        padding: 2px 10px;
        font-size: 1.4em;
        font-weight: bold;
    }
    .rooms-drawer {
        position: fixed;
        right: 0;
        top: 100px;
        bottom: 60px;
        width: 50px;
        overflow: hidden;
        transition: width 0.3s ease;
    }

    .rooms-drawer.modal-open {
        overflow: visible;
        z-index: 2500;
    }

    .rooms-drawer.expanded {
        /* width: max(320px, calc(33.333vw/1.5)); */
        width: clamp(320px, 24vw, 420px);
    }

    .rooms-panel {
        margin-right: 55px;
        height: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(10, 235, 0, 0.6);
        background: rgba(15, 19, 20);
        backdrop-filter: blur(10px);
        padding: 36px;
        overflow-y: auto;
    }

    .rooms-panel:hover {
        border-color: #0aeb00;
        background: rgba(10, 235, 0, 0.01);
    }

    .rooms-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
    }

    h2 {
        /* margin: 0 0 14px; */
        color: #0aeb00;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-align: left;
    }

    /* Custom scrollbar maybe not work for Firefox */
    .rooms-panel::-webkit-scrollbar {
        width: 12px;
    }

    .rooms-panel::-webkit-scrollbar-thumb {
        background: #b13bcc;
    }

    .rooms-panel::-webkit-scrollbar-track {
        background: rgba(30, 157, 189, 0.3);
        /* background: rgba(0, 0, 0, 0.3); */
    }

    .filter-toolbar {
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
    }

    .search-input,
    .sort-select {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(10, 235, 0, 0.3);
        color: #0aeb00;
        padding: 6px 1px;
        outline: none;
    }

    .search-input:focus,
    .sort-select:focus {
        border-color: #0aeb00;
        /* box-shadow: 0 0 5px rgba(10, 235, 0, 0.5); */
    }

    .sort-select option {
        background: #0f1314;
        color: #0aeb00;
    }

    .no-rooms {
        color: #666;
        font-style: italic;
        text-align: center;
        margin-top: 20px;
    }

    .room-error-message {
        margin: 0 0 16px;
        color: #ff7a7a;
        text-align: left;
        font-size: 0.9rem;
    }

    @media (max-width: 1180px) {
        .rooms-drawer.expanded {
            width: min(360px, calc(50vw - 34px));
        }

        .rooms-drawer {
            bottom: 109px;
        }

        .rooms-drawer.chat-open {
            bottom: calc(53px + max(240px, 45vh) + 12px);
        }
    }
</style>
