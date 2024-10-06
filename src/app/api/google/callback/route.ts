import { cookies } from 'next/headers'
import { OAuth2RequestError } from 'arctic'
import db from '@/lib/db'
import { github, google, loginUser } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = cookies().get('google_oauth_state')?.value ?? null
  const storedCodeVerifier = cookies().get('google_code_ver')?.value ?? null

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, {
      status: 400,
    })
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier
    )
    const response = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    )
    const gUser = await response.json()
    let user = await db.user.findFirst({
      where: {
        goole_id: String(gUser.sub),
      },
    })
    if (!user) {
      user = await db.user.create({
        data: {
          name: gUser.name,
          email: gUser.email,
          avatar: gUser.picture,
          goole_id: gUser.sub,
        },
      })
    }
    await loginUser(user.id)
    return NextResponse.redirect(new URL('/profile', request.url))
  } catch (error: any) {
    console.log(error)

    if (error.code === 'P2002') {
      return NextResponse.redirect(
        new URL('/auth?error=This email alrady used.', request.url)
      )
    }

    if (error instanceof OAuth2RequestError) {
      return NextResponse.json({
        error: 'Invalid code',
      })
    }
    return NextResponse.json({
      error: 'An error occurred',
    })
  }
}
