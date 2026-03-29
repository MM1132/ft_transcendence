<script>
  import { currentPath } from './stores/router'
  import { authStore } from './stores/authStore'

  import Layout from './components/Layout.svelte'

  import LoginPage from './routes/LoginPage.svelte'
  import HomePage from './routes/HomePage.svelte'
  import DashboardPage from './routes/DashboardPage.svelte'
  import SignUpPage from './routes/SignUpPage.svelte'
  import SettingPage from './routes/SettingPage.svelte'
  import WorkPage from './routes/WorkPage.svelte'
  import RoomPage from './routes/RoomPage.svelte'
  import GamePage from './routes/GamePage.svelte'

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
      {:else if $currentPath === '/work'}
      <WorkPage />
      {:else if $currentPath === '/game'}
        <GamePage />
      {:else if $currentPath.startsWith ('/room/')}
      <RoomPage roomId={$currentPath.split('/')[2]}/>
      {/if}
  {/key}
</Layout>