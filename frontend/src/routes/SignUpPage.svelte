<script>
  import SignupForm from "../components/SignupForm.svelte";
  import { authService } from "../services/authService";
  import { navigateTo } from "../stores/router";
  
  let signupError = $state('');
  let isLoading = $state(false);

  async function handleSignup({ username, password, email })
  {
    signupError = '';
    isLoading = true;

    const result = await authService.signup(username, password, email);
    
    isLoading = false;
    
    if(result.success)
    {
      navigateTo('/login');
    }
    else
    {
      signupError = result.message;
    }

  }
</script>

<SignupForm onSubmit={handleSignup} signupError={signupError}/>
