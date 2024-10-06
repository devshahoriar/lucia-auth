'use client'
import { register } from '@/action/auth'
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

const SignUp = () => {
  const [state, formAction] = useActionState(register, undefined)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Register a new account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-2" action={formAction}>
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Name" name="name" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="enmail" type="text" placeholder="Email" name="email" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="pass">Password</Label>
            <Input
              id="pass"
              type="password"
              placeholder="Password"
              name="pass"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="conpass">Confirm password</Label>
            <Input
              id="conpass"
              type="password"
              name="conpass"
              placeholder="Confirm Passoword"
            />
          </div>
          <p className="text-red-600">{(state as any)?.error}</p>
          <p className="text-green-600">{(state as any)?.message}</p>
          <div className="flex justify-center">
            <Button type="submit">Register</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
export default SignUp
