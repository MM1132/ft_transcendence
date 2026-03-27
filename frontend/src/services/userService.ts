import { buildApiPath } from '../utils/constants';
import { extractErrorMessage, fetchWithSessionHandling } from './serviceUtils';
import { buildAuthHeaders } from './settingsService';

export type UserSummary = {
  id: string;
  username: string;
  avatarUrl: string;
  lastActionAt: string | null;
  online: boolean;
};

export type UserDetails = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  lastActionAt: string | null;
  balance: number;
  createdAt: string;
  birthday: string | null;
  fullName: string | null;
  bio: string | null;
  online: boolean;
};

const MY_USER_API_URL = buildApiPath('/user/me');
const USERS_API_URL = buildApiPath('/user');

export const userService = {
  async getMyProfile(): Promise<UserDetails> {
    const response = await fetchWithSessionHandling(MY_USER_API_URL, {
      method: 'GET',
      headers: buildAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }

    return (await response.json()) as UserDetails;
  },

  async getProfileById(userId: string): Promise<UserDetails> {
    const response = await fetchWithSessionHandling(buildApiPath(`/user/${userId}`), {
      method: 'GET',
      headers: buildAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }

    return (await response.json()) as UserDetails;
  },

  async getAllUsers(): Promise<UserSummary[]> {
    const response = await fetchWithSessionHandling(USERS_API_URL, {
      method: 'GET',
      headers: buildAuthHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }

    return (await response.json()) as UserSummary[];
  },
};
