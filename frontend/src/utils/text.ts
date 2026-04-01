export function truncateUsername(username: string, maxLength = 6): string
{
    return username.length > maxLength ? `${username.slice(0, maxLength)}.` : username;
}
