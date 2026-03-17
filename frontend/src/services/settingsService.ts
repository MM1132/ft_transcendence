import { buildApiPath, SESSION_STORAGE_KEY, type AuthSessionData } from "../utils/constants";

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


const SETTINGS_PATH = '/user/me/settings';
const SETTINGS_API_URL = buildApiPath(SETTINGS_PATH);

function api(path: string): string {
  return buildApiPath(path);
}

export const settingsService = {
  async getUserSettings(): Promise<UserSettings> {
    const response = await fetch(SETTINGS_API_URL, { //fetch request an backend
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
    return (user.avatarUrl ?? null);
  },

  async updateUserSettings( // die eingegebenen werte ans backend schicken als 'payload'
    payload: UpdateUserSettingsPayload
  ): Promise<UserSettings> {
    const response = await fetch(SETTINGS_API_URL, {
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
    return (body.avatarUrl ?? null);
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
    const body = await response.json() as { error?: string };
    return body.error || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}


export function buildAuthHeaders(): HeadersInit
{
  // authStore writes the current session to sessionStorage under "auth_session".
  const rawSession = sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) {
    // if no session token available send no auth-header then backend will return 401
    return {};
  }

  try {
    const parsed = JSON.parse(rawSession) as AuthSessionData;
    if (parsed.sessionToken) {
      return { 'x-session-token': parsed.sessionToken };
    }
  } catch (_error) {
    // something went wrong, do nothinge value and continue unauthenticated.
  }
  // no automatic x-dev fallback in normal frontend requests, our fallback —> just send no token
  return {};
}
