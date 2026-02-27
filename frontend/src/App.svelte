<script>
  import { writable } from 'svelte/store'
  import { fade } from 'svelte/transition'
  
  import LoginPage from './routes/LoginPage.svelte'
  import HomePage from './routes/HomePage.svelte'
  import DashboardPage from './routes/DashboardPage.svelte'
  import SignUpPage from './routes/SignUpPage.svelte'
  import SettingPage from './routes/SettingPage.svelte'


  // const currentPath = writable(window.location.pathname || '/')

  export const currentPath = writable(window.location.pathname);


  window.addEventListener('popstate', () => {
    currentPath.set(window.location.pathname || '/')
  })

  export function navigateTo(path) 
  {
    window.history.pushState(null, '', path)
    currentPath.set(path)
  }

  window.navigateTo = navigateTo
</script>


{#key $currentPath}
  <div in:fade={{duration: 150 }} out:fade={{ duration: 150 }}>
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
  </div>
{/key}
