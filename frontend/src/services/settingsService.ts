export type UserSettings = { // was ich vom Backend bekomme, kann auch null sein
  birthday: string | null;
  fullName: string | null;
  bio: string | null;
};

type UserProfile = {
  avatarUrl?: string | null;
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
// !NOT FOR DEPLOY
//todo : ASK Robert first - check env probably <--------------------------------------
const API_ORIGIN = 'http://localhost:8080';

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

  // fallback when upload response has no URL
  async getMyAvatarUrl(): Promise<string | null> {
    const response = await fetch(api('/user/me'), {
      method: 'GET',
      headers: buildAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }

    const user = (await response.json()) as UserProfile;
    return normalizeAvatarUrl(user.avatarUrl ?? null);
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

  async uploadAvatar(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const response = await fetch(api(`${SETTINGS_PATH}/avatar`), {
      method: 'PUT',
      headers: buildAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }

    // json is returned i must make it string
    const body = (await response.json()) as { avatarUrl?: string | null };
    return normalizeAvatarUrl(body.avatarUrl ?? null);
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

// covert relative backend path - avoid broken image
function normalizeAvatarUrl(url: string | null | undefined): string | null {
  const value = url?.trim();
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('http:/')) return value.replace('http:/', 'http://');
  if (value.startsWith('https:/')) return value.replace('https:/', 'https://');
  if (value.startsWith('/')) return `${API_ORIGIN}${value}`;
  return value;
}
