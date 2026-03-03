<script>
    import { get } from "svelte/store";
    import LoginForm from "../components/LoginForm.svelte";
    import { authStore } from "../stores/authStore";
    import Layout from "../components/Layout.svelte";

    async function handleLogin({ username, password })
    {
        await authStore.login(username, password);

        const { isLoggedIn } = get(authStore);
        if (isLoggedIn)
        {
            window.navigateTo('/dashboard')
        }
    }
</script>



<Layout>
    <LoginForm onSubmit={handleLogin} />
</Layout>


