import { buildApiPath } from '../utils/constants';
import { buildAuthHeaders } from './settingsService';
import { extractErrorMessage } from './serviceUtils';

export type WorkResponse = {
  message: string;
  gainedBalance: number;
  balance: number;
};

const WORK_API_URL = buildApiPath('/skills/work');

export const workService = {
  async work(): Promise<WorkResponse> {
    const response = await fetch(WORK_API_URL, {
      method: 'POST',
      headers: buildAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await extractErrorMessage(response));
    }

    return await response.json() as WorkResponse;
  },
};
