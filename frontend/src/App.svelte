<!--
This file will be the application shell. It should handle:
1.  Rooting/Navigation - Which page to show based on URL or state
2.  Global Layout - Elements that appear on All pages
3.  Authentication Flow - Show Login Page vs Dashboard
4.  Global State - Acess to stores for authentication status 
-->


<script>
  import { writable } from 'svelte/store'
  import LoginPage from './routes/LoginPage.svelte'
  import HomePage from './routes/HomePage.svelte'
  import DashboardPage from './routes/DashboardPage.svelte'
  import SettingPage from './routes/SettingPage.svelte'


  const currentPath = writable(window.location.hash.slice(1) || '/')

  window.addEventListener('hashchange', () => {
    currentPath.set(window.location.hash.slice(1) || '/')
  })
</script>


{#if $currentPath === '/'}
  <HomePage />
{:else if $currentPath === '/login'}
  <LoginPage />
{:else if $currentPath === '/settings'}
    <SettingPage />
{:else if $currentPath === '/dashboard'}
  <DashboardPage />
{/if}
