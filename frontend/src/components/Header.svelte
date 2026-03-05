<script>
    import { authStore } from '../stores/authStore';
    import { navigateTo } from '../stores/router';
    
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
</script>


<header>
  <div id="header">
    <div class="header-logo">
      <img src="src/images/c.svg" alt="Logo"/>
    </div>
     <div class="header-nav">
     {#if $authStore.isLoggedIn}
        <div class="avatar-container">
            <button class="avatar" onclick={toggleDropdown}>
                <p>Image</p>
            </button>
            {#if showDropdown}
                <div class="dropdown">
                    <button onclick={goToSettings}>Settings</button>
                    <button onclick={handleLogout}>Logout</button>
                </div>
            {/if}
      </div>
      {/if}
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