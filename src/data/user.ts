/**
 * Single source of truth for the logged-in user's profile. Prototype only —
 * in production this would come from an auth/profile service.
 *
 * The app's avatar initials (ProfileScreen + AppHeader) derive from `name`
 * via `getInitials` so they stay in sync.
 */
export const userProfile = {
  name: 'Janette Dovington',
  memberSince: '28 Feb 2021',
  accountId: '20dd49d81296285849988ebf0797c857',
} as const;

/** First letter of first word + first letter of last word, uppercased. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
