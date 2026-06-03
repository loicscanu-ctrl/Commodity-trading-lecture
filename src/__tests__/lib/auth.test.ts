import { isAuthenticated } from '@/lib/auth'

test('returns true when session cookie is "valid"', () => {
  expect(isAuthenticated('valid')).toBe(true)
})

test('returns false when session cookie is undefined', () => {
  expect(isAuthenticated(undefined)).toBe(false)
})

test('returns false when session cookie has wrong value', () => {
  expect(isAuthenticated('wrong-value')).toBe(false)
})
