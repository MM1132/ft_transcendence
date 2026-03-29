<script>
  import { currentPath, navigateTo } from './stores/router'
  import { authStore } from './stores/authStore'
  import Layout from './components/Layout.svelte'
  import LoginPage from './routes/LoginPage.svelte'
  import HomePage from './routes/HomePage.svelte'
  import DashboardPage from './routes/DashboardPage.svelte'
  import SignUpPage from './routes/SignUpPage.svelte'
  import SettingPage from './routes/SettingPage.svelte'
  import WorkPage from './routes/WorkPage.svelte'
  import ProfilePage from './routes/ProfilePage.svelte'
  import RoomPage from './routes/RoomPage.svelte'
  import GamePage from './routes/GamePage.svelte'
  import PrivacyPolicyPage from './routes/PrivacyPolicyPage.svelte'
  import TermsPage from './routes/TermsPage.svelte'

  const publicAuthPaths = ['/', '/login', '/signup']

  authStore.initFromSession()

  $: if ($authStore.isLoggedIn && publicAuthPaths.includes($currentPath)) {
    navigateTo('/dashboard')
  }
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
      {:else if $currentPath === '/work'}
        <WorkPage />
      {:else if $currentPath === '/game'}
        <GamePage />
      {:else if $currentPath === '/privacy-policy'}
        <PrivacyPolicyPage />
      {:else if $currentPath === '/terms-of-service'}
        <TermsPage />
      {:else if $currentPath.startsWith ('/room/')}
        <RoomPage roomId={$currentPath.split('/')[2]}/>
      {:else if $currentPath === '/profile' || $currentPath.startsWith('/profile/')}
        <ProfilePage />
      {/if}
  {/key}
</Layout>
