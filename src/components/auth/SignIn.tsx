'use client'
import { login } from '@/action/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState } from 'react'

const SignIn = () => {
  const [state, formAction] = useActionState(login, undefined)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Signin using your email and password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-2" action={formAction}>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Email" name="email" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" placeholder="Password" />
          </div>

          <p className="text-red-600">{(state as any)?.error}</p>
          <p className="text-green-600">{(state as any)?.message}</p>
          <div className="flex justify-center">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
export default SignIn
