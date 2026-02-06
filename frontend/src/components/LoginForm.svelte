<script>
    import Button from './Button.svelte';
    import { authService } from '../services/authService';
    
    let username = $state('');
    let password = $state('');
    let usernameError = $state('');
    let formError = $state('');
    
    const { onSubmit } = $props();

    // Validate username in real-time as user types
    function validateUsernameInput()
    {
        usernameError = authService.validateUsername(username) || '';
    }

    function handleSubmit(event)
    {
        event.preventDefault();
        
        // Clear previous errors
        formError = '';
        usernameError = '';
        
        // Validate username
        const usernameValidation = authService.validateUsername(username);
        if (usernameValidation)
        {
            usernameError = usernameValidation;
            return;
        }
        
        // Validate password
        if (password.length === 0)
        {
            formError = 'Password is required';
            return;
        }
        
        if (password.length < 4)
        {
            formError = 'Password must be at least 4 characters';
            return;
        }
        
        onSubmit?.({ username, password });
    }
</script>


<div id="login-form">
    <form onsubmit={handleSubmit}>
        <div class="input-group">
            <p>USERNAME</p>
            <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                bind:value={username}
                oninput={validateUsernameInput}
                class:error={usernameError}
                required
            />
            {#if usernameError}
                <p class="error-message">{usernameError}</p>
            {/if}
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
        {#if formError}
            <p class="error-message form-error">{formError}</p>
        {/if}
        <Button type="submit">Login</Button>
    </form>
</div>















<style>
    #login-form
    {
        width: auto;
        margin: 0 auto;
        padding: 6rem;
        border: 1px solid rgba(10, 235, 0, 0.1);
        border-radius: 0px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        transition: all 0.3s;
    }

    #login-form:hover
    {
        border-color: #0AEB00;
        background: rgba(10, 235, 0, 0.02);
        transform: translate(-50%, -50%) translateY(-5px);
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
    
    .input-group
    {
        margin-bottom: 3rem;
    }

    .input-group p
    {
        text-align: left;
        color: #B13BCC;
        font-size: 14px;
        font-weight: 800;
        margin: 0 0 8px 13px;
    }

    .error-message
    {
        color: #ff4444;
        font-size: 12px;
        margin: 8px 0 0 13px;
        text-align: left;
    }

    .form-error
    {
        text-align: center;
        margin: 0 0 20px 0;
    }

    input.error
    {
        border-color: #ff4444;
    }

</style>