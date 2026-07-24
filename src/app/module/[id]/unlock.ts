'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkModuleCode, moduleCookieName } from '@/lib/moduleAccess'

/** Unlock a module with the code the instructor gives in class. */
export async function unlockModule(moduleId: number, returnTo: string, formData: FormData) {
  const code = (formData.get('code') as string) ?? ''

  if (!checkModuleCode(moduleId, code)) {
    // A short-lived, non-sensitive flag so the lock screen can say "wrong code"
    cookies().set('module-code-error', '1', { maxAge: 5, sameSite: 'lax' })
    redirect(returnTo)
  }

  cookies().set(moduleCookieName(moduleId), 'valid', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 60, // one entry per device per module, for the term
  })
  redirect(returnTo)
}
