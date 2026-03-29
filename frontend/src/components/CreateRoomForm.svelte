<script lang="ts">
	import Button from './Button.svelte';

	
   let { onClose, onCreate } = $props<{
        onClose: () => void;
        onCreate: (room: { name: string; entryFee: number; maxPlayers: number }) => void;
    }>();

	let name = $state('');
    let entryFee = $state('');
    let maxPlayers = $state('');

    let nameError = $state('');
    let entryFeeError = $state('');
    let maxPlayersError = $state('');


    async function handleSubmit(event: Event)
    {
        event.preventDefault();
        const entryFeeNum = Number(entryFee);
        const maxPlayersNum = Number(maxPlayers);

        if (name.length < 1) 
            nameError = "Name must be at least 1 character";
        else if (name.length > 20) 
            nameError = "Name max 20 characters";

        if (entryFeeNum < 1 || entryFeeNum > 500)
            entryFeeError = "Entry Fee 1 - 500";
        if (maxPlayersNum < 2 || maxPlayersNum > 4)
            maxPlayersError = "Players 2 - 4";

        if (nameError || entryFeeError || maxPlayersError)
            return;
        
        try {
            onCreate({
                name,
                entryFee: Number(entryFee),
                maxPlayers: Number(maxPlayers)
            });
            onClose();
        } catch (err) {
            console.error("Failed to create room:", err);
        }
    }

    function clearError(field: 'name' | 'entryFee' | 'maxPlayers')
    {
        if (field === 'name') nameError = '';
        if (field === 'entryFee') entryFeeError = '';
        if (field === 'maxPlayers') maxPlayersError = '';
    }
</script>

<div class="modal-overlay">
	<div class="modal">
		<h2>Create Room</h2>
        <form onsubmit={handleSubmit}>
            <div class= "input-group">
            <p>ROOM NAME</p>
                <label>
                    <input type="text" placeholder ="Room name (max 20 chars)" bind:value={name}  class:error={nameError} oninput={()=> clearError('name')} required />
                </label>
                 {#if nameError}
                    <p class="error-message">{nameError}</p>
                {/if}
            </div>
            <div class= "input-group">
                <p>Entry Fee</p>
                <label>
                    <input type="number" placeholder ="1 - 500" bind:value={entryFee}  class:error={entryFeeError}  oninput={()=> clearError('entryFee')} required/>
                </label>
                {#if entryFeeError}
                    <p class="error-message">{entryFeeError}</p>
                {/if}
            </div>
            <div class="input-group">
                <p>Max Players</p>
                <label>
                    <input type="number" min="2" max="4" placeholder ="2 - 4" bind:value={maxPlayers} class:error={maxPlayersError} oninput={()=> clearError('maxPlayers')} required/>
                </label>
                {#if maxPlayersError}
                <p class="error-message">{maxPlayersError}</p>
                {/if}
            </div>
                <div class="actions">
                    <Button type="button" variant="cancel" onclick={onClose}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </div>
		</form>
	</div>
</div>

<style>
.modal-overlay
{
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0,0,0,0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal
{
	background: #181a1b;
	padding: 82px 82px;
    border: 1px solid rgba(10, 235, 0, 0.1);
    background: rgba(15, 19, 20, 0.9);
    backdrop-filter: blur(12px);
}

.modal:hover
{
    border-color: #0AEB00;
    background: rgba(10, 235, 0, 0.02); 
}

label
{
	display: block;
	margin-bottom: 16px;
	color: #fff;
}

input
{
	width: 300px;
	height: 50px;
	padding: 10px;
	font-size: 16px;
	border: 1px solid #0AEB00;
	background-color: #1a1a1a;
	color: white;
}

input:focus
{
	outline: none;
	border-color: #B13BCC;
}

input:-webkit-autofill
{
	background-color: #1a1a1a !important;
	color: white !important;
	-webkit-text-fill-color: white !important;
	-webkit-box-shadow: 0 0 0 1000px #1a1a1a inset !important;
}

.input-group
{
    margin-bottom: 4rem;
}

input.error
{
    border: 2px solid #ff4444;
}

.input-group p
{
    text-align: left;
    color: #B13BCC;
    font-size: 14px;
    font-weight: 800;
    margin: 0 0 8px 13px;
}

p.error-message
{
   color: #ff4444;
   font-size: 12px;
   margin: 8px 0 0 13px;
   text-align: left;
}

.actions
{
	display: flex;
	justify-content: flex-end;
	gap: 24px;
	margin-top: 24px;
}

h2
{
	color: #0AEB00;
	margin-bottom: 24px;
}

</style>