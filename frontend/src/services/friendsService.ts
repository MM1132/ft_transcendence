import { buildApiPath } from '../utils/constants';
import { buildAuthHeaders } from './settingsService';
import { extractErrorMessage } from './serviceUtils';

export interface UserSummary {
  id: string;
  username: string;
  avatarUrl: string;
  lastActionAt: string | null;
  online: boolean;
}

interface SendFriendRequestResponse {
  status: string;
  message: string;
}

export interface IncomingFriendRequest {
  id: string;
  userFrom: UserSummary;
  createdAt: string;
}

export interface OutgoingFriendRequest {
  id: string;
  userTo: UserSummary;
  createdAt: string;
}

interface RemoveFriendResponse {
  status: string;
  message: string;
}

const FRIENDS_API_URL = buildApiPath('/friends');
const ONLINE_USERS_API_URL = buildApiPath('/user/online');
const FRIEND_REQUESTS_API_URL = buildApiPath('/friend-requests');

export const friendsService = {
  async getMyFriends(): Promise<UserSummary[]> {
    const response = await fetch(FRIENDS_API_URL, {
      method: 'GET',
      headers: buildAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await extractErrorMessage(response));
    }

    return (await response.json()) as UserSummary[];
  },

  async getOnlineUsers(): Promise<UserSummary[]> {
    const response = await fetch(ONLINE_USERS_API_URL, {
      method: 'GET',
      headers: buildAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await extractErrorMessage(response));
    }

    return (await response.json()) as UserSummary[];
  },

  async sendFriendRequest(userId: string): Promise<SendFriendRequestResponse> {
    const response = await fetch(FRIEND_REQUESTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...buildAuthHeaders(),
      },
      body: JSON.stringify({ userId }),
    });

    const body = (await response.json()) as SendFriendRequestResponse;
    if (!response.ok) {
      throw new Error(body.message || body.status || `Request failed (${response.status})`);
    }

    return body;
  },

  async getIncomingFriendRequests(): Promise<IncomingFriendRequest[]> {
    const response = await fetch(`${FRIEND_REQUESTS_API_URL}?direction=in`, {
      method: 'GET',
      headers: buildAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await extractErrorMessage(response));
    }

    return (await response.json()) as IncomingFriendRequest[];
  },

  async getOutgoingFriendRequests(): Promise<OutgoingFriendRequest[]> {
    const response = await fetch(`${FRIEND_REQUESTS_API_URL}?direction=out`, {
      method: 'GET',
      headers: buildAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await extractErrorMessage(response));
    }

    return (await response.json()) as OutgoingFriendRequest[];
  },

  async removeFriend(userId: string): Promise<RemoveFriendResponse> {
    const response = await fetch(`${FRIENDS_API_URL}/${userId}`, {
      method: 'DELETE',
      headers: buildAuthHeaders(),
    });

    const body = (await response.json()) as RemoveFriendResponse;
    if (!response.ok) {
      throw new Error(body.message || body.status || `Request failed (${response.status})`);
    }

    return body;
  },
};
