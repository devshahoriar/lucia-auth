'use client'
import {  logout } from '@/action/auth'
import { Button } from '../ui/button'
import Link from 'next/link'

const Logout = () => {
  const onSubmit = (e: any) => {
    e.preventDefault()
    localStorage.removeItem('auth')
    logout()
  }

  return (
    <form onSubmit={onSubmit} className="flex justify-center gap-3 mt-5">
      <Button type="submit" variant="outline">
        Logout
      </Button>
      <Button asChild type="button" variant="outline">
        <Link href="/">Home</Link>
      </Button>
    </form>
  )
}
export default Logout
