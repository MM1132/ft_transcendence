<script>
  import SignupForm from "../components/SignupForm.svelte";
  import { authService } from "../services/authService";
  import Layout from "../components/Layout.svelte";

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

<Layout>
  <SignupForm onSubmit={handleSignup}/>
</Layout>

