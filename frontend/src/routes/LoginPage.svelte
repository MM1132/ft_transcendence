<script>
    import { get } from "svelte/store";
    import LoginForm from "../components/LoginForm.svelte";
    import { authStore } from "../stores/authStore";
    import { navigateTo } from "../stores/router";
    
    async function handleLogin({ username, password })
    {
        await authStore.login(username, password);

        const { isLoggedIn } = get(authStore);
        if (isLoggedIn)
        {
            navigateTo('/dashboard')
        }
    }
</script>

<LoginForm onSubmit={handleLogin} />


