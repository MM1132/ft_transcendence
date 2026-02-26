export type UserSettings = { // was ich vom Backend bekomme, kann auch null sein
  birthday: string | null;
  fullName: string | null;
  bio: string | null;
  avatar_url?: string | null; // maybe exist,maybe not if so
};

export type UpdateUserSettingsPayload = { // was ich zum Backend schicken, optional auch nur z.B. bio (wegen dem ?)
  birthday?: string | null;
  fullName?: string | null;
  bio?: string | null;
};

// const API_BASE = import.meta.env.VITE_API_URL ?? '';

function api(path: string): string {
  return `http://localhost:8080/api/v1${path}`;
}

const SETTINGS_PATH = '/user/me/settings';

export const settingsService = {
  async getUserSettings(): Promise<UserSettings> {
    const response = await fetch(api(SETTINGS_PATH), { //fetch request an backend
      method: 'GET',
      headers: buildAuthHeaders(), // send session token
    });

    if (!response.ok) { // falls antwort nicht ok ist, error message aus response extrahieren und error werfen
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }

    return (await response.json()) as UserSettings; // json in UserSettings umwandeln
  },

  async updateUserSettings( // die eingegebenen werte ans backend schicken als 'payload'
    payload: UpdateUserSettingsPayload
  ): Promise<UserSettings> {
    const response = await fetch(api(SETTINGS_PATH), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // damit backend weiss, dass es json ist
        ...buildAuthHeaders(), // ... klappt die werte aus
      },
      body: JSON.stringify(payload), // payload in json umwandeln, damit es ans backend geschickt werden kann
    });

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }

    return (await response.json()) as UserSettings;
  },

  async uploadAvatar(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file, 'my-avatar.png');  // ? maybe better change it to avatar 
    // ! check backend
    // * its fun to override , isnt it?

    // create headers  authorization
    const headers = buildAuthHeaders(); // as Record<string , string>; // for predicatable headers["authorization"]

    const response = await fetch(api(`${SETTINGS_PATH}/avatar`), {
      method: 'PUT',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }
  },

  async deleteAvatar(): Promise<void> {
    const response = await fetch(api(`${SETTINGS_PATH}/avatar`), {
      method: 'DELETE',
      headers: buildAuthHeaders(),
    });

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }
  }

};

async function extractErrorMessage(response: Response): Promise<string>
{
  try {
    const body = (await response.json()) as { error?: string };
    if (body?.error) return body.error;
  } catch {
    // Ignore JSON parsing errors and return a generic message below
  }
  return `Request failed (${response.status})`;
}

function buildAuthHeaders(): HeadersInit
{
  const sessionToken = localStorage.getItem('sessionToken'); // wenn session token exists, dann nimm den
  if (sessionToken) {
    return { 'x-session-token': sessionToken };
  }

  // ansonsten dev token in header
  return { 'x-dev': '1' };
}
