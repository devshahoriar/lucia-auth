import { validateRequest } from '@/auth'
import SignIn from '@/components/auth/SignIn'
import SignUp from '@/components/auth/SignUp'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import next from 'next'

const AuthPage = async ({ searchParams: { error } }: any) => {
  const auth = await validateRequest()

  if (auth.user) {
    redirect('/profile')
  }
 
  return (
    <section className="container h-screen flex items-center justify-center">
      <div className="w-[400px]">
        <h2 className="text-3xl font-bold mb-10 text-center">Lucia Auth</h2>
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}
        <div className="w-[400px] flex gap-2">
          <a  className="flex-1" href="/api/google/signin">
            <Button className="space-x-2 w-full" variant="outline">
              <Image src="/google.svg" alt="google" width={20} height={20} />
              <span>Google</span>
            </Button>
          </a>
          <a className="flex-1" href="/api/github/signin">
            <Button className="space-x-2 w-full" variant="outline">
              <Image src="/github.svg" alt="google" width={20} height={20} />
              <span>Github</span>
            </Button>
          </a>
        </div>
        <div className="flex h-5 items-center gap-3 my-4">
          <Separator className="flex-1" />
          Or
          <Separator className="flex-1" />
        </div>
        <Tabs defaultValue="signin" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SignIn />
          </TabsContent>
          <TabsContent value="signup">
            <SignUp />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
export default AuthPage
