const API_URL = 'http://localhost:3000/api/v1';

export type LoginResult =
  | {
      success: true;
      userId: string;
      sessionToken: string;
    }
  | {
      success: false;
      message: string;
      statusCode: number;
    };

type MyUserResponse = {
  id: string;
};

export const authService = {
  validateUsername(name: string): string | null {
    if (name.length === 0) return 'Username is required';
    if (name.length < 6) return 'Username must be at least 6 characters';
    if (name.length > 30) return 'Username must be at most 30 characters';

    const alphanumeric = /^[a-zA-Z0-9]+$/;
    if (!alphanumeric.test(name)) {
      return 'Username must be alphanumeric - No symbols allowed ($#%@)';
    }

    return null;
  },

  validatePassword(password: string): string | null {
    if (password.length === 0) return 'Password is required';
    if (password.length < 12) return 'Password must be at least 12 characters';

    return null;
  },

  async login(username: string, password: string): Promise<LoginResult> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          message: body?.error ?? 'Login failed',
          statusCode: response.status,
        };
      }

      return {
        success: true,
        userId: body.userId,
        sessionToken: body.sessionToken,
      };
    } catch (_error) {
      return {
        success: false,
        message: 'Connection failed. Is the server running?',
        statusCode: 0,
      };
    }
  },

  async getMyUser(sessionToken: string): Promise<MyUserResponse | null> {
    try {
      const response = await fetch(`${API_URL}/user/me`, {
        method: 'GET',
        headers: {
          'x-session-token': sessionToken,
        },
      });

      if (!response.ok) return null;

      return await response.json();
    } catch (_error) {
      return null;
    }
  },
};
