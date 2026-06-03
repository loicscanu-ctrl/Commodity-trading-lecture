export function isAuthenticated(sessionCookie: string | undefined): boolean {
  return sessionCookie === 'valid'
}
