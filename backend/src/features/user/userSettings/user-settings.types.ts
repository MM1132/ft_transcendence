export interface UpdateUserSettingsRequestBody {
  birthday?: string | null;
  fullName?: string | null;
  bio?: string | null;
}

export interface UserSettingsResponse {
  birthday: string | null;
  fullName: string | null;
  bio: string | null;
}
