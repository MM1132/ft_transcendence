const API_URL = 'http://localhost:3000/api/v1';

export interface AuthResult
{
  success: boolean;
  message: string;
  user?: any;
}

export const authService =
{
  validateUsername(username: string): string | null
  {
    if (username.length === 0) return "Username is required";
    if (username.length < 6) return "Username must be at least 6 characters";
    if (username.length > 30) return "Username max 30 characters";
    
    const alphanumeric = /^[a-zA-Z0-9]+$/;
    if (!alphanumeric.test(username))
    {
      return "No symbols allowed ($#%@)";
    }
    
    return null;
  },

  validatePassword(password: string): string | null
  {
    if(password.length === 0) return "Password is required";
    if(password.length < 12) return "Password must me at least 12 characters";
    if(password.length > 128) return "Password max 128 characters";
    
    return null;
  },


  async login(username: string, password: string): Promise<AuthResult>
  {
    try
    {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({username, password})
      });

      const data = await response.json();

      if(response.ok)
      {
        return {success:true, message: "Login successful", user:data};
      }
      else
      {
        return{success:false, message: data.message || "Login failed"};
      }
    }
    catch(error)
    {
      return{success:false, message: "Network error. Please try again."};
    }
  },

  async signup(username: string, password:string) : Promise<AuthResult>
  {
    try
    {
      const response = await fetch(
        `${API_URL}/users`,
        {method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({username, password})
      });

      const data = await response.json();

      if(response.ok)
      {
        return {success:true, message: "Account created successful", user:data};
      }
      else
      {
        return{success:false, message: data.message || "Signup failed"};
      }
    }
    catch(error)
    {
      return{success:false, message: "Network error. Please try again."};
    }
  }
}
