import { cookies } from 'next/headers'
import { OAuth2RequestError } from 'arctic'
import db from '@/lib/db'
import { github, loginUser } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = cookies().get('github_oauth_state')?.value ?? null
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    })
  }

  try {
    const tokens = await github.validateAuthorizationCode(code)
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })
    const githubUser: GitHubUser = await githubUserResponse.json()

    let user = await db.user.findFirst({
      where: {
        github_id: String(githubUser.id),
      },
    })
    if (!user) {
      user = await db.user.create({
        data: {
          name: githubUser.name,
          email: githubUser.email,
          avatar: githubUser.avatar_url,
          github_id: String(githubUser.id),
        },
      })
    }
    await loginUser(user.id)
    return NextResponse.redirect(
      new URL('/profile', request.url)
    )
  } catch (e: any) {
    console.log(e)

    if (e.code === 'P2002') {
      return NextResponse.redirect(
        new URL('/auth?error=This email alrady used.', request.url)
      )
    }

    if (e instanceof OAuth2RequestError) {
      return NextResponse.json({
        error: 'Invalid code',
      })
    }
    return NextResponse.json({
      error: 'Something went wrong',
    })
  }
}

interface GitHubUser {
  id: string
  name: string
  email: string
  avatar_url: string
}
