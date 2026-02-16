import type { DateTime } from 'luxon';
import type { QueryResultRow } from 'pg';

// Repository types
export interface RepositoryUserSummary extends QueryResultRow {
  id: string;
  username: string;
  last_action_at: DateTime;
  avatar_filename: string | null;
}

export interface RepositoryUserDetails extends QueryResultRow {
  id: string;
  username: string;
  password: string;
  email: string;
  avatar_filename: string | null;
  last_action_at: DateTime;
  created_at: DateTime;
  birthday: DateTime;
  full_name: string | null;
  balance: string;
}

// Output types
export interface UserSummary {
  id: number;
  username: string;
  avatarUrl: string;
  lastActionAt: string | null;
}

export interface UserDetails extends UserSummary {
  email: string;
  createdAt: string;
  birthday: string | null;
  fullName: string | null;
  balance: number;
}
