import { Lucia } from 'lucia'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import db from '@/lib/db'
import { cache } from 'react'
import { Session, User } from '../../prisma/out'
import { cookies } from 'next/headers'
const adapter = new PrismaAdapter(db.session, db.user)

import { GitHub, Google } from 'arctic'

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!
)
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  'http://localhost:3000/api/google/callback'
)

const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: 'admin-token',
    expires: false,

    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    
    const u: any = {
      name: attributes.name,
      email: attributes.email,
    }
    attributes.github_id && (u.github_id = attributes.github_id)
    attributes.goole_id && (u.google_id = attributes.goole_id)
    return u
  },
})

export const validateRequest = cache(
  async (): Promise<
    { user: Omit<User,'password'>; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
    if (!sessionId) {
      return {
        user: null,
        session: null,
      }
    }

    const result = (await lucia.validateSession(sessionId)) as any
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id)
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        )
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie()
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        )
      }
    } catch {}
    return result
  }
)

export const loginUser = async (id: string) => {
  const session = await lucia.createSession(id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
}

export const logoutUser = async () => {
  const { session } = await validateRequest()
  if (!session) {
    throw new Error('No session found')
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
}

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  name: string
  email: string
  github_id?: string
  goole_id?: string
}

// export default lucia
