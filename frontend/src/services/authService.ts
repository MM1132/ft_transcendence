const API_URL = 'http://localhost:3000/api/v1';

export interface LoginResult
{
  success: boolean;
  message: string;
}

export const authService =
{
  validateUsername(name: string): string | null
  {
    if (name.length === 0) return "Name is required";
    if (name.length > 20) return "Max 20 characters";
    
    const alphanumeric = /^[a-zA-Z0-9]+$/;
    if (!alphanumeric.test(name))
    {
      return "No symbols allowed ($#%@)";
    }
    
    return null;
  },

  async login(username: string, password: string): Promise<LoginResult>
  {
    return new Promise((resolve) =>
    {
      setTimeout(() =>
      {
        if (username === 'testuser' && password === 'test1234')
        {
          resolve({ success: true, message: "Welcome!" });
        }
        else if (password === 'wrongpass')
        {
          resolve({ success: false, message: "Invalid password" });
        }
        else
        {
          resolve({ success: false, message: "User not found" });
        }
      }, 1000);
    });
  }
};
