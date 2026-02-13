export interface UpdateUserSettingsRequestBody {
  birthday?: string | null;
  fullName?: string | null;
}

export interface UserSettingsResponse {
  birthday: string | null;
  fullName: string | null;
}
