import type { DateTime } from 'luxon';
import type { QueryResultRow } from 'pg';

// Repository types
export interface RepositoryUserSummary extends QueryResultRow {
  id: string;
  username: string;
  last_action_at: DateTime;
  avatar_filename: string | null;

  online: boolean;
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
  bio: string | null;

  online: boolean;
}

// Output types
export interface UserSummary {
  id: string;
  username: string;
  avatarUrl: string;
  lastActionAt: string | null;

  online: boolean;
}

export interface UserDetails extends UserSummary {
  email: string;
  createdAt: string;
  birthday: string | null;
  fullName: string | null;
  balance: number;
  bio: string | null;
}
