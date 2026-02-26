import type { Client } from 'pg';
import { levelsRepository } from './levels.repository.ts';

export interface WorkResponse {
  message: string;
  gainedBalance: number;
  balance: number;
}

export const levelsService = {
  work: async (db: Client, userId: string): Promise<WorkResponse> => {
    const addBalanceAmount = Math.floor(Math.random() * 10) + 1;

    const newBalance = await levelsRepository.addUserBalance(
      db,
      userId,
      addBalanceAmount
    );

    if (!newBalance) throw new Error("Could not increase user's balance");

    return {
      balance: parseInt(newBalance.balance, 10),
      gainedBalance: addBalanceAmount,
      message: `You worked and gained ${addBalanceAmount} balance!`,
    };
  },
};
