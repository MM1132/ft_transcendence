<script>
  import { currentPath } from './stores/router'
  import { authStore } from './stores/authStore'

  import Layout from './components/Layout.svelte'
  
  import LoginPage from './routes/LoginPage.svelte'
  import HomePage from './routes/HomePage.svelte'
  import DashboardPage from './routes/DashboardPage.svelte'
  import SignUpPage from './routes/SignUpPage.svelte'
  import SettingPage from './routes/SettingPage.svelte'

  authStore.initFromSession()
</script>


<Layout>
  {#key $currentPath}
      {#if $currentPath === '/'}
        <HomePage />
      {:else if $currentPath === '/login'}
        <LoginPage />
      {:else if $currentPath === '/signup'}
        <SignUpPage />
      {:else if $currentPath === '/dashboard'}
        <DashboardPage />
      {:else if $currentPath === '/setting'}
        <SettingPage />
      {/if}
  {/key}
</Layout>