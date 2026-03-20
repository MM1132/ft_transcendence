export async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string; message?: string; status?: string };
    return body.error || body.message || body.status || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}
