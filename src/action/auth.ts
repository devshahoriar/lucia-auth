'use server'
import bcrypt from 'bcrypt'
import db from '@/lib/db'
import  { loginUser, logoutUser } from '@/auth'

import { redirect } from 'next/navigation'
const register = async (pv: any, fromstate: FormData) => {
  try {
    const res: any = Object.fromEntries(fromstate.entries())
    if (res.pass !== res.conpass) {
      return { error: 'Password does not match' }
    }
    const hashPass = await bcrypt.hash(res.pass, 10)
    const newUser = await db.user.create({
      data: {
        name: res.name,
        email: res.email,
        password: hashPass,
      },
    })

    console.log(newUser)

    return { message: 'User registered' }
  } catch (error) {
    console.log(error)

    return { error: 'Something went wrong' }
  }
}

const login = async (pv: any, fromstate: FormData) => {
  try {
    const res: any = Object.fromEntries(fromstate.entries())
    const exUser = await db.user.findUnique({
      where: {
        email: res.email,
      },
    })
    if (!exUser) {
      return { error: 'User does not exist' }
    }
    if (!exUser?.password) {
      return { error: 'User use social login' }
    }
    const isMached = await bcrypt.compare(res.password, exUser?.password as any)

    if (!isMached) {
      return { error: 'Password does not match' }
    }

    await loginUser(exUser.id)
    return redirect('/profile')
  } catch (error) {
    console.log(error)

    return { error: 'Something went wrong' }
  }
}

const logout = async () => {
  await logoutUser()
  return redirect('/auth')
}

export { register, login, logout }
