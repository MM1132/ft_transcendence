<script>
  import SignupForm from "../components/SignupForm.svelte";
  import { authService } from "../services/authService";

  let signupError = $state('');
  let isLoading = $state(false);

  async function handleSignup({ username, password })
  {
    signupError = '';
    isLoading = true;

    const result = await authService.signup(username, password);
    
    isLoading = false;
    
    if(result.success)
    {
      window.navigateTo('/login');
    }
    else
    {
      signupError = result.message;
    }

  }
</script>

<main>
<SignupForm onSubmit={handleSignup}/>
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

