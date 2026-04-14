export type UpsertUserSettings = {
  userId: string;
  email?: string;
  name?: string;
  uploadAvatar?: string;
  colorTheme?: string;
  themeDarkMode?: boolean;
};

export type GetUserSettings = {
  userId: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  colorTheme?: string;
  themeDarkMode?: boolean;
};
