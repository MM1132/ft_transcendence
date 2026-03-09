<script lang="ts">
    export let room;
</script>

<div class="room-card">
    <h3>{room.name}</h3>
    <p>Players: {room.currentPlayers} / {room.maxPlayers}</p>
    <p>Entry Fee: {room.entryFee}</p>
</div>

<style>
    .room-card
    {
        color:rgb(255, 255, 255);
    }
</style>