<script>
    import { authStore } from '../stores/authStore';
    import { navigateTo } from '../stores/router';
    import { settingsService } from '../services/settingsService';
    
    let showDropdown = $state(false);
    let avatarUrl = $state(null);
    
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

    // Keep avatar loading in one place so every route gets the same header behavior.
    async function loadAvatar()
    {
        if (!$authStore.isLoggedIn)
        {
            avatarUrl = null;
            return;
        }

        try
        {
            avatarUrl = await settingsService.getMyAvatarUrl();
        }
        catch (_error)
        {
            avatarUrl = null;
        }
    }

    // Re-run when auth state changes (login/logout) to switch between user avatar and default icon.
    $effect(() => {
        if (!$authStore.isLoggedIn)
        {
            avatarUrl = null;
            showDropdown = false;
            return;
        }

        void loadAvatar();
    });
</script>


<header>
  <div id="header">
    <div class="header-logo">
      <img src="src/images/c.svg" alt="Logo"/>
    </div>
    <div class="header-nav">
        <div class="avatar-container">
            <!-- Always render the avatar button: image for logged-in users, default icon otherwise. -->
            <button class="avatar" onclick={toggleDropdown} type="button" aria-label="Open user menu">
                {#if avatarUrl}
                    <img class="avatar-image" src={avatarUrl} alt="User avatar" />
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
    </div>
  </div>
</header>

<style>
    .avatar-container
    {
        position: relative;
    }

    .avatar
    {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background:rgba(255, 255, 255, 0.1);
        /* padding: 0;
        margin: 0; */
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .avatar:hover
    {
          border: 1px solid #0AEB00;
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
