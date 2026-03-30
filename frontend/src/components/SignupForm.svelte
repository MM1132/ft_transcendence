<script>
    import Button from './Button.svelte';
    import { authService } from '../services/authService';
    import { navigateTo } from '../stores/router';

    let username = $state('');
    let password = $state ('');
    let email = $state('');
    let confirmPassword = $state('');
    
    let usernameError = $state('');
    let passwordError = $state('');
    let confirmPasswordError = $state('');
    let emailError = $state('');


    const { onSubmit, signupError = '' } = $props();

    function clearErrors()
    {
        usernameError = '';
        passwordError = '';
        confirmPasswordError = '';
        emailError = '';
    }

    $effect(() => {
        clearErrors();

        if (!signupError)
            return;

        const normalizedError = signupError.toLowerCase();

        if (normalizedError.includes('username'))
        {
            usernameError = signupError;
            return;
        }

        if (normalizedError.includes('email'))
        {
            emailError = signupError;
            return;
        }

        passwordError = signupError;
    });


    function handleSubmit(event)
    {
        event.preventDefault();
        
        clearErrors();
        
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

        if (confirmPassword == '')
        {
            confirmPasswordError = 'Please fill out this field';
            return;
        }

        if(password !== confirmPassword)
        {
            confirmPasswordError = 'Passwords do not match';
            return;
        }

        const emailValidation = authService.validateEmail(email)
        if(emailValidation)
        {
            emailError = emailValidation;
            return ;
        }
    
        onSubmit?.({ username, password, email });
    }
</script>




<div class="signup-container">
    <div id="signup-form">
        <h1 class="signup-title">SIGN UP</h1>
        <form onsubmit={handleSubmit} novalidate>
            <div class="input-group">
                <p>USERNAME</p>
                <input
                type = "text"
                name = "username"
                id = "username"
                placeholder = "Username"
                bind:value={username}
                oninput={clearErrors}
                class:error={usernameError}
                required
                />
                {#if usernameError}
                <p class="error-message">{usernameError}</p>
                {/if}
            </div>
            <div class="input-group">
                <p>EMAIL</p>
                <input
                type = "email"
                placeholder = "Email"
                bind:value={email}
                oninput={clearErrors}
                class:error={emailError}
                required
                />
                {#if emailError}
                <p class="error-message">{emailError}</p>
                {/if}
            </div>
            <div class="input-group">
                <p>PASSWORD</p>
                <input
                type="password"
                id="password"
                placeholder="Password"
                bind:value={password}
                oninput={clearErrors}
                class:error={passwordError}
                required
                />
                {#if passwordError}
                <p class="error-message">{passwordError}</p>
                {/if}
            </div>
             <div class="input-group">
                <p>CONFIRM PASSWORD</p>
                <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                bind:value={confirmPassword}
                oninput={clearErrors}
                class:error={confirmPasswordError}
                required
                />
                {#if confirmPasswordError}
                <p class="error-message">{confirmPasswordError}</p>
                {/if}
            </div>
            <Button type="submit">Sign up</Button>
        </form>
        <p class="login">
            Do you have an account? 
            <a href="/login" onclick={(e) => { e.preventDefault(); navigateTo('/login'); }}>
                Login
            </a>
        </p>
    </div>
</div>



<style>
    
    .signup-container
    {
        position: fixed;
        top: 100px;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(100vw - 32px);
    }

    #signup-form
    {
        width: auto;
        max-width: min(520px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 4rem;
        padding-top: 2.5rem;
        padding-bottom: 4rem;
        max-height: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(10, 235, 0, 0.1);
        border-radius: 0px;
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        transition: all 0.3s;
        overflow: auto;
    }
    
    #signup-form:hover
    {
        border-color: #0AEB00;
        background: rgba(10, 235, 0, 0.02);
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

    input.error
    {
        border: 2px solid #ff4444;
    }

    .input-group
    {
        margin-bottom: 2rem;
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
    
    .signup-title
    {
        color: #B13BCC;
        letter-spacing: 0.2em;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .login
    {
        text-align: center;
        margin-top: 2rem;
        color: #888;
        font-size: 14px;
        
    }

    .login a
    {
        color: #0AEB00;
        text-decoration: none;
        font-weight: 600;
        margin-left: 20px;
    }

    .login a:hover
    {
        text-decoration: underline;
        /* color: #B13BCC; */
    }

    @media (max-width: 640px)
    {
        .signup-container
        {
            width: calc(100vw - 24px);
        }

        #signup-form
        {
            padding: 2rem 1.25rem 2.5rem;
        }

        .input-group
        {
            margin-bottom: 2rem;
        }

        .signup-title
        {
            margin-bottom: 2rem;
        }

        .login
        {
            margin-top: 2rem;
        }
    }

</style>