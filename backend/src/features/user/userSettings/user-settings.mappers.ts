import type { RepositoryUserSettings } from './user-settings.repository.ts';
import type { UserSettingsResponse } from './user-settings.types.ts';

export const userSettingsRowToResult = (
  settings: RepositoryUserSettings
): UserSettingsResponse => ({
  birthday: settings.birthday ? settings.birthday.toFormat('yyyy-LL-dd') : null,
  fullName: settings.full_name,
  bio: settings.bio,
});
