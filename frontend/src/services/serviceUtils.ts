import { authStore } from '../stores/authStore';

export async function fetchWithSessionHandling(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401) {
    authStore.logout();
    throw new Error('Session expired');
  }

  return response;
}

export async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string; message?: string; status?: string };
    return body.error || body.message || body.status || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}
