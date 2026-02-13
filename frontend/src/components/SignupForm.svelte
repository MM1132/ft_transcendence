<!--
i need for the signup form the next variables
#username
#email
#password
#confirmPassword
#usernameDublicateError   (check the name did not exist)
#formError

1) a fuction that will validate the name
2) a function that will handle the event
3)
-->


<script>
    import Button from './Button.svelte';
    import { authService } from '../services/authService';

    let username = $state('');
    let password = $state ('');
    let email = $state('');
    let usernameError = $state('');
    let emailError = $state('');
    let confirmPassword = $state('');
    let formError = $state('');

    const { onSubmit } = $props();

    function handleSubmit(event)
    {
        event.preventDefault();
        
        // Clear previous errors
        formError = '';
        usernameError = '';
        
        const usernameValidation = authService.validateUsername(username);
        if (usernameValidation)
        {
            usernameError = usernameValidation;
            return;
        }
        
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




<div class="signup-container">
    <div id="signup-form">
        <h1 class="signup-title">SIGN UP</h1>
        <form onsubmit={handleSubmit}>
            <div class="input-group">
                <p>USERNAME</p>
                <input
                type = "text"
                name = "username"
                id = "username"
                placeholder = "Username"
                bind:value={username}
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
                class:error={emailError}
                required
                />
                {#if emailError}
                <p class="error-message">{Error}</p>
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
             <div class="input-group">
                <p>CONFIRM PASSWORD</p>
                <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                bind:value={confirmPassword}
                required
                />
            </div>
            {#if formError}
            <p class="error-message form-error">{formError}</p>
            {/if}
            <Button type="submit">Sign up</Button>
        </form>
    </div>
</div>



<style>
    
    .signup-container
    {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    #signup-form
    {
        width: auto;
        margin: 0 auto;
        padding: 6rem;
        padding-top: 4rem;
        padding-bottom: 6rem;
        border: 1px solid rgba(10, 235, 0, 0.1);
        border-radius: 0px;
        background: rgba(15, 19, 20, 0.6);
        backdrop-filter: blur(10px);
        transition: all 0.3s;
    }
    
    #signup-form:hover
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

    .signup-title
    {
        color: #B13BCC;
        letter-spacing: 0.2em;
        text-align: center;
        margin-bottom: 3rem;
        /* transform: translateX(20px); */
    }

</style>