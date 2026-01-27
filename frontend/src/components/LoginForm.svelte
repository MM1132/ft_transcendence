<script>
    import Button from './Button.svelte';
    
    let username = $state('');
    let password = $state('');
    
    let { onLogin } = $props();

    function handleSubmit(event)
    {
        event.preventDefault();
        onLogin?.({ username, password });
    }
</script>


<div id="login-form">
    <form on:submit|preventDefault={handleSubmit}>
        <div class="input-group">
            <p>USERNAME</p>
            <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                bind:value={username}
                required
            />
        </div>
        <div class="input-group">
            <p>PASSWORD</p>
            <input
                type="password"
                id="password"
                placeholder="Password"
                bind:value={password}
                required
            />
        </div>
        <Button type="submit">Login</Button>
    </form>
</div>

<style>
    #login-form
    {
        width: 350px;
        margin: 0 auto;
        padding: 5rem;
        border: 4px solid #0AEB00;
        border-radius: 0px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .input-group
    {
        margin-bottom: 3rem;
    }

    .input-group p
    {
        align-self: flex-start;
        margin: 8;
        color: #B13BCC;
        font-size: 14px;
        font-weight: 800; 
    }

    input
    {
        width: 100%;
        padding: 0.5rem;
        background-color: #f5f5f5;
        border: 1px solid #ccc;
    }

    #username
    {
        width: 300px;
        height: 50px;
        padding: 10px;
        font-size: 16px;
        border: 2px solid #0AEB00;
        background-color: #1a1a1a;
        color: white;
    }

    #password
    {
        width: 300px;
        height: 50px;
        padding: 10px;
        font-size: 16px;
        border: 2px solid #0AEB00;
        background-color: #1a1a1a;
        color: white;
    }

</style>