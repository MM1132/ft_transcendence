<script>
    import { authStore } from '../stores/authStore';
    import Logo from './Logo.svelte';
    import { currentPath, navigateTo } from '../stores/router'; //need this one as to know if i render avatar block
    import { settingsService } from '../services/settingsService';
    import { avatarStore } from '../stores/avatarStore';
    
    let showDropdown = $state(false);
    
    function toggleDropdown()
    {
        if (!$authStore.isLoggedIn)
            return;
        showDropdown = !showDropdown;
    }
    
    function handleLogout()
    {
        showDropdown = false;
        authStore.logout();
        navigateTo('/');
    }
    
    function goToSettings()
    {
        showDropdown = false;
        navigateTo('/setting');
    }

    function goToDashboard()
    {
        showDropdown = false;
        navigateTo('/dashboard');
    }

    // as the browser to treat as a new URL, so it reloads the latest avatar/ no old cached image
    function withAvatarVersion(url)
    {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}v=${Date.now()}`;
    }

    // Keep avatar loading in one place so every route gets the same header behavior.
    async function loadAvatar()
    {
        if (!$authStore.isLoggedIn)
        {
            avatarStore.set(null);
            return;
        }

        try
        {
            const myAvatarUrl = await settingsService.getMyAvatarUrl();
            avatarStore.set(myAvatarUrl ? withAvatarVersion(myAvatarUrl) : null);
        }
        catch (_error)
        {
            avatarStore.set(null);
        }
    }

    // Re-run when auth state changes (login/logout) to switch between user avatar and default icon.
    $effect(() => {
        if (!$authStore.isLoggedIn)
        {
            avatarStore.set(null);
            showDropdown = false;
            return;
        }

        void loadAvatar();
    });
</script>


<header>
  <div id="header">
    <div class="header-logo">
    {#if $authStore.isLoggedIn}
      <Logo handleLogoClick={goToDashboard}/>
    {/if}
    </div>
    <div class="header-nav">
    <!-- When route becomes /, that whole block is not rendered. -->
        {#if $currentPath !== '/' && $currentPath !== '/login' && $currentPath !== '/signup'}
        <div class="avatar-container">
            <!-- Always render the avatar button: image for logged-in users, default icon otherwise. -->
            <button class="avatar" onclick={toggleDropdown} type="button" aria-label="Open user menu">
                {#if $avatarStore}
                    <img class="avatar-image" src={$avatarStore} alt="User avatar" />
                {:else}
                    <svg class="avatar-default-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                {/if}
            </button>
            {#if $authStore.isLoggedIn && showDropdown}
                <div class="dropdown">
                    <button onclick={goToSettings}>Settings</button>
                    <button onclick={handleLogout}>Logout</button>
                </div>
            {/if}
        </div>
        {/if}
    </div>
  </div>
</header>

<style>
    #header
    {
        width: 100%;
        height: 80px;
        background-color: #0f1314;
        backdrop-filter: blur(10px);
        position: fixed;
        top: 0;
        left: 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .header-nav
    {
        display: flex;
        gap: 60px;
        flex: 1;
        justify-content: flex-end;
        margin-right: 45px;
    }

    .avatar-container
    {
        position: relative;
    }

    .avatar
    {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background:rgba(255, 255, 255, 0.1);
        padding: 0;
        /* margin: 0; */
        display: flex;
        align-items: center;
        justify-content: center;
        cursor:pointer;
        padding: 0;
    }

    .avatar:hover
    {
        /* border:  0px solid #B13BCC; */
        outline: 2px solid #B13BCC;
        /* outline-offset: 2px; */
        /* transform: scale(1.1); */
    }

    .avatar-image
    {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }

    .avatar-default-icon
    {
        width: 24px;
        height: 24px;
        color: #0AEB00;
    }
    .dropdown
    {
        position: absolute;
        top: 80px;
        right: 0;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background: rgba(15, 19, 20, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 0px;
        transition: all 0.3s;
        min-width: 150px;
    }

    .dropdown:hover
    {
       border-color: #0AEB00;
       background: rgba(10, 235, 0, 0.02); 
    }

    .dropdown button
    {
        width: 100%;
        padding: 12px 16px;
        background: rgba(15, 19, 20, 0.9);
        border: none;
        color: white;
        cursor: pointer;
        text-align: left;
    }

    .dropdown button:hover
    {
        background: #B13BCC;
    }
</style>
