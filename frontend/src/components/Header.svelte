<script>
    import { authStore } from '../stores/authStore';
    import { navigateTo } from '../stores/router';
    import Logo from './Logo.svelte';
    
    let showDropdown = $state(false);
    
    function toggleDropdown()
    {
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
</script>


<header>
    <div id="header">
        {#if $authStore.isLoggedIn}
        <Logo handleLogoClick ={goToDashboard} />
        <div class="header-nav">
            <div class="avatar-container">
                <button class="avatar" type="button" onclick={toggleDropdown}>
                    <p>Image</p>
                </button>
                {#if showDropdown}
                    <div class="dropdown">
                        <button type="button" onclick={goToSettings}>Settings</button>
                        <button type="button" onclick={handleLogout}>Logout</button>
                    </div>
                {/if}
            </div>
        </div>
        {/if}
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
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 1px solid rgba(10, 235, 0, 0.1);
        background:rgba(255, 255, 255, 0.1);
        padding: 0;
        /* margin: 0; */
        display: flex;
        align-items: center;
        justify-content: center;
        cursor:pointer;
    }

    .avatar:hover
    {
          border: 1px solid #0AEB00;
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