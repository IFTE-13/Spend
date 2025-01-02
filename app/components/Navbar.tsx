import { Button } from '@/components/ui/button'
import { checkUser } from '@/utils/checkUser'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { HandCoins, LayoutDashboard, PenBox } from 'lucide-react'
import Link from 'next/link'

export const Navbar = async () => {
  await checkUser();
  return (
    <div className='sticky top-0 h-18 w-full bg-white/80 backdrop-blur-md z-50 border-b'>
      <nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href={"/"}>
          <HandCoins size={30}/>
        </Link>

        <div className='flex items-center space-x-4'>
          <SignedIn>
            <Link  href={"/dashboard"} className='text-gray-600 hover:text-blue-600 flex items-center gap-2'>
              <Button variant={"outline"}>
              <LayoutDashboard size={18}/>
              <span className='hidden md:block'>Dashboard</span>  
              </Button>
            </Link>
            <Link  href={"/transaction/create"} className='flex items-center gap-2'>
              <Button>
              <PenBox size={18}/>
              <span className='hidden md:block'>Add Transaction</span>  
              </Button>
            </Link>
            <UserButton appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}/>
          </SignedIn>
        <SignedOut>
          <SignInButton forceRedirectUrl={"/dashboard"}>
            <Button variant={"outline"}>Login</Button>
          </SignInButton>
        </SignedOut>
          
        </div>
      </nav>
    </div>
  )
}
