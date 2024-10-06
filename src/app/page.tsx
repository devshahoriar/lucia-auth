import { validateRequest } from '@/auth'
import Image from 'next/image'
import Link from 'next/link'

const HomePage = async () => {
  const { user } = await validateRequest()
  return (
    <section className="container">
      <nav className="mt-5 bg-black bg-opacity-10 p-5 rounded-md shadow-lg flex justify-between items-center">
        <p className="font-extrabold text-2xl">Luchia Auth</p>
        {user ? (
          <div className='flex gap-3 items-center'>
            <h1 className='text-lg font-bold'>{user.name}</h1>
            <Link className="font-semibold hover:underline" href="/profile">
              Profile
            </Link>
          </div>
        ) : (
          <Link className="font-semibold hover:underline" href="/auth">
            Login
          </Link>
        )}
      </nav>
      <div className="mt-10">
        <h1 className="text-5xl">Lucia auth library</h1>
        <div className="flex items-center gap-10 mt-5">
          <Image alt="logo" src="/prisma.png" width={80} height={80} />
          <Image alt="logo" src="/next.svg" width={120} height={120} />
        </div>
      </div>
    </section>
  )
}
export default HomePage
