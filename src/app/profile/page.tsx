import { logout } from '@/action/auth'
import { validateRequest } from '@/auth'
import Logout from '@/components/auth/Logout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const ProfilePage = async () => {
  const auth = await validateRequest()

  if (!auth.user) {
    redirect('/auth')
  }

  return (
    <section className="h-screen flex justify-center items-center">
      <Card className="w-[400px]">
        <CardContent className="pt-5 overflow-hidden">
          <h1 className="text-xl font-semibold">Profile</h1>
          <p>Welcome to your profile page.</p>
          <div>
            <pre>{JSON.stringify(auth, null, 2)}</pre>
          </div>
          <Logout />
        </CardContent>
      </Card>
    </section>
  )
}
export default ProfilePage
