import type { Client } from 'pg';

interface RepositoryBalance {
  balance: string;
}

export const levelsRepository = {
  addUserBalance: async (
    db: Client,
    userId: string,
    addBalanceAmount: number
  ): Promise<RepositoryBalance | null> => {
    const { rows } = await db.query<RepositoryBalance>(
      `
			UPDATE users
			SET balance = balance + $2
			WHERE id = $1
			RETURNING balance;
		`,
      [userId, addBalanceAmount]
    );
    return rows[0] ?? null;
  },
};
