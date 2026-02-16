<script>
    import Button from './Button.svelte';
    import { authService } from '../services/authService';


    let username = $state('');
    let password = $state('');
    let usernameError = $state('');
    let passwordError = $state('');
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
        passwordError = '';
        
        const usernameValidation = authService.validateUsername(username);
        if (usernameValidation)
        {
            usernameError = usernameValidation;
            return;
        }

        const passwordValidation = authService.validatePassword(password);
        if(passwordValidation)
        {
            passwordError = passwordValidation;
            return;
        }
        
        
        
        onSubmit?.({ username, password });
    }
</script>



<div class="login-container">
    
    <div id="login-form">
        <h1 class="login-title">LOGIN</h1>
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
        <p class="signup">
            Don't have an account? 
            <a href="/signup" onclick={(e) => { e.preventDefault(); window.navigateTo('/signup'); }}>
                Sign up
            </a>
        </p>
    </div>
</div>
    
    

<style>
    
    .login-container
    {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    #login-form
    {
        width: auto;
        margin: 0 auto;
        padding: 6rem;
        padding-top: 2rem;
        border: 1px solid rgba(10, 235, 0, 0.1);
        border-radius: 0px;
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        transition: all 0.3s;
    }
    
    #login-form:hover
    {
        border-color: #0AEB00;
        background: rgba(10, 235, 0, 0.02);
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
        margin-bottom: 4rem;
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

    .login-title
    {
        color: #B13BCC;
        letter-spacing: 0.2em;
        text-align: center;
        margin-bottom: 1rem;
        padding: 2rem;
        /* transform: translateX(-90px); */
    }

    .signup
    {
        text-align: center;
        margin-top: 3rem;
        color: #888;
        font-size: 14px;
        
    }

    .signup a
    {
        color: #0AEB00;
        text-decoration: none;
        font-weight: 600;
        margin-left: 20px;
    }

    .signup a:hover
    {
        text-decoration: underline;
        /* color: #B13BCC; */
    }
    
</style>