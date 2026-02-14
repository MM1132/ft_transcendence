<script>
    import { get } from "svelte/store";
    import LoginForm from "../components/LoginForm.svelte";
    import { authStore } from "../stores/authStore";
    import { authService } from "../services/authService";
    import Layout from "../components/Layout.svelte";

    let loginError = $state('');
    let isLoading = $state(false);

    // async function handleLogin({ username, password })
    // {
    //     loginError = '';
    //     isLoading = true;

    //     const result = await authService.login(username, password);
        
    //     isLoading = false;
        
    //     if(result.success)
    //     {
    //         authStore.update(state => ({
    //             ...state,
    //             isLoggedIn: true,
    //             user: result.user
    //         }));
    //         window.navigateTo('/dashboard');
    //     }
    //     else
    //     {
    //         loginError = result.message;
    //     }
    // }


    async function handleLogin({ username, password })
    {
        console.log('Login attempt:', username, password);
        await authStore.login(username, password);

        const { isLoggedIn, user } = get(authStore);
        if (isLoggedIn)
        {
            console.log('Login successful! User:', user);
            window.navigateTo('/dashboard')
        }
    }
</script>



<Layout>
    <LoginForm onSubmit={handleLogin} />
    
    <!-- {#if $authStore.isLoading}
        <div class="loading-overlay">
            <p>Logging in...</p>
        </div>
    {/if}
    
    {#if $authStore.errorMessage}
        <div class="error-overlay">
            <p>{$authStore.errorMessage}</p>
        </div>
    {/if}
    
    {#if $authStore.isLoggedIn}
        <div class="success-overlay">
            <p>Welcome, {$authStore.user}! ✓</p>
        </div>
    {/if} -->
</Layout>


<style>
    .loading-overlay,
    .error-overlay,
    .success-overlay
    {
        position: fixed;
        bottom: 90px;
        right: 20px;
        padding: 20px 30px;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    }

    .loading-overlay
    {
        background: rgba(10, 235, 0, 0.2);
        border: 1px solid #0AEB00;
        color: #0AEB00;
    }

    .error-overlay
    {
        background: rgba(255, 68, 68, 0.2);
        border: 1px solid #ff4444;
        color: #ff4444;
    }

    .success-overlay
    {
        background: rgba(10, 235, 0, 0.3);
        border: 1px solid #0AEB00;
        color: #0AEB00;
    }

    @keyframes slideIn
    {
        from
        {
            transform: translateX(400px);
            opacity: 0;
        }
        to
        {
            transform: translateX(0);
            opacity: 1;
        }
    }
</style>
