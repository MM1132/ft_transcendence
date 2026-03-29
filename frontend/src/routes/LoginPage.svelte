<script>
    import { get } from "svelte/store";
    import LoginForm from "../components/LoginForm.svelte";
    import { authStore } from "../stores/authStore";
    import { navigateTo } from "../stores/router";

    let loginError = $state('');
    
    async function handleLogin({ username, password })
    {
        loginError = '';
        await authStore.login(username, password);

        const { isLoggedIn, errorMessage } = get(authStore);
        if (isLoggedIn)
        {
            navigateTo('/dashboard')
            return;
        }

        loginError = errorMessage || 'Wrong username or password';
    }
</script>

<LoginForm onSubmit={handleLogin} loginError={loginError} />

