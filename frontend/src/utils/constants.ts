function normalizePath(path: string): string
{
  return path.startsWith('/') ? path : `/${path}`;
}

export const buildApiPath = (path: string): string =>
{
  return `/api/v1${normalizePath(path)}`;
};
