<script>
  import SignupForm from "../components/SignupForm.svelte";
  import { authService } from "../services/authService";

  async function handleSignup({ username, password })
  {
    const result = await authService.login(username, password);
    if(result.success)
    {
      window.navigateTo('/login');
    }

  }
</script>

<main>
<SignupForm onsubmit={handleSignup}/>
</main>

<header>
  <div id="header">
    <div class="header-logo">
      <img src="src/images/c.svg" alt="Logo"/>
    </div>
     <div class="header-nav">
    </div>
  </div>
</header>


<footer>
<div id="footer">
  <p>&copy; 2026 ft_trancendence. All rights reserved.</p>
</div>
</footer>

