export type UserSettings = { // was ich vom Backend bekomme, kann auch null sein
  birthday: string | null;
  fullName: string | null;
  bio: string | null;
};

export type UpdateUserSettingsPayload = { // was ich zum Backend schicken, optional auch nur z.B. bio (wegen dem ?)
  birthday?: string | null;
  fullName?: string | null;
  bio?: string | null;
};

const SETTINGS_URL = '/api/v1/user/me/settings';

export const settingsService = {
  async getUserSettings(): Promise<UserSettings> {
    const response = await fetch(SETTINGS_URL, { //fetch request an backend
      method: 'GET',
      headers: buildAuthHeaders(), // send session token
      credentials: 'include', // fuer cookies usw.
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
    const response = await fetch(SETTINGS_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // damit backend weiss, dass es json ist
        ...buildAuthHeaders(), // ... klappt die werte aus
      },
      credentials: 'include',
      body: JSON.stringify(payload), // payload in json umwandeln, damit es ans backend geschickt werden kann
    });

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }

    return (await response.json()) as UserSettings;
  },
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
