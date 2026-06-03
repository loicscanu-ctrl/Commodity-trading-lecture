'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function authenticate(formData: FormData) {
  const password = formData.get('password') as string

  if (password !== process.env.CLASS_PASSWORD) {
    redirect('/login?error=1')
  }

  cookies().set('session', 'valid', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  redirect('/')
}
