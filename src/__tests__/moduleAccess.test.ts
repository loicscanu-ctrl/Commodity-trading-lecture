import { checkModuleCode, moduleCode, moduleCookieName } from '@/lib/moduleAccess'

test('every module has its own unlock code, checked case- and space-insensitively', () => {
  // Each of the five modules carries a non-empty default code
  for (let m = 1; m <= 5; m++) expect(moduleCode(m)).toBeTruthy()
  // The check tolerates case and stray whitespace…
  expect(checkModuleCode(1, '  Saigon ')).toBe(true)
  expect(checkModuleCode(2, 'ANTWERP')).toBe(true)
  // …but one module's code does NOT open another module
  expect(checkModuleCode(2, 'saigon')).toBe(false)
  expect(checkModuleCode(1, 'antwerp')).toBe(false)
  expect(checkModuleCode(1, '')).toBe(false)
  // Each module stores its own cookie
  expect(moduleCookieName(3)).not.toBe(moduleCookieName(4))
})

test('module codes can be overridden per environment', () => {
  process.env.MODULE_1_CODE = 'espresso'
  try {
    expect(checkModuleCode(1, 'espresso')).toBe(true)
    expect(checkModuleCode(1, 'saigon')).toBe(false)
  } finally {
    delete process.env.MODULE_1_CODE
  }
})
