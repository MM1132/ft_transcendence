<script>
    import Button from './Button.svelte';
    import { authService } from '../services/authService';
    import { navigateTo } from '../stores/router';


    let username = $state('');
    let password = $state('');

    let usernameError = $state('');
    let passwordError = $state('');
    let hasAuthError = $state(false);
    
    const { onSubmit, loginError = '' } = $props();

    function clearAuthError()
    {
        usernameError = '';
        passwordError = '';
        hasAuthError = false;
    }

    $effect(() => {
        clearAuthError();

        if (!loginError)
            return;

        hasAuthError = true;
        passwordError = loginError;
    });

    function handleSubmit(event)
    {
        event.preventDefault();
        
        // Clear previous errors
        usernameError = '';
        passwordError = '';
        
        const usernameValidation = authService.validateUsername(username);
        if (usernameValidation)
        {
            usernameError = usernameValidation;
            hasAuthError = true;
            return;
        }

        const passwordValidation = authService.validatePassword(password);
        if (passwordValidation)
        {
            hasAuthError = true;
            passwordError = 'Wrong username or password';
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
                oninput={clearAuthError}
                class:error={hasAuthError}
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
                oninput={clearAuthError}
                class:error={hasAuthError}
                required
                />
                {#if hasAuthError}
                    <p class="error-message">{passwordError || 'Wrong username or password'}</p>
                {/if}
            </div>
            <Button type="submit">Login</Button>
        </form>
        <p class="signup">
            Don't have an account? 
            <a href="/signup" onclick={(e) => { e.preventDefault(); navigateTo('/signup'); }}>
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
        max-width: min(460px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 6rem;
        padding-top: 2rem;
        box-sizing: border-box;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        border-radius: 0px;
        transition: all 0.3s;
    }
    
    #login-form:hover
    {
        border-color: #0AEB00;
        /* background: rgba(10, 235, 0, 0.02); */
    }
    
    input
    {
        width: 300px;
        max-width: 100%;
        height: 50px;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #0AEB00;
        background-color: #1a1a1a;
        color: white;
        box-sizing: border-box;
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
    
    .input-group p
    {
        text-align: left;
        color: #B13BCC;
        font-size: 14px;
        font-weight: 800;
        margin: 0 0 8px 13px;
    }

    input.error
    {
        border: 2px solid #ff4444;
    }

    p.error-message
    {
        color: #ff4444;
        font-size: 12px;
        margin: 8px 0 0 13px;
        text-align: left;
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

    @media (max-width: 640px)
    {
        .login-container
        {
            width: calc(100vw - 24px);
        }

        #login-form
        {
            padding: 2rem 1.25rem;
        }

        .input-group
        {
            margin-bottom: 2rem;
        }

        .login-title
        {
            padding: 1rem 0 1.5rem;
            margin-bottom: 0.5rem;
        }

        .signup
        {
            margin-top: 2rem;
        }
    }
    
</style>
