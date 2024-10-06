'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect } from 'react'

const auth = createContext(null)
export const useAuth = () => useContext(auth)

const AuthProvider = ({ children, user }: any) => {
  const { push } = useRouter()
  useEffect(() => {
    if (user) {
      localStorage.setItem('auth', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth')
    }
    const redirect = (e: any) => {
      if (e.key === 'auth') {
        push('/auth')
      }
    }
    window.addEventListener('storage', redirect)
    return () => window.removeEventListener('storage', redirect)
  }, [])

  return <auth.Provider value={user}>{children}</auth.Provider>
}
export default AuthProvider
