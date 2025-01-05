import { Button } from '@/components/ui/button'
import { checkUser } from '@/utils/checkUser'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { LayoutDashboard, PenBox } from 'lucide-react'
import Link from 'next/link'

const navigationItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    href: '/transactions',
    label: 'Transaction',
    icon: PenBox
  },
]

export const Navbar = async () => {
  await checkUser();
  return (
    <div className='sticky top-0 h-18 w-full bg-white/80 backdrop-blur-md z-50 border-b'>
      <nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <div></div>

        <div className='flex items-center space-x-4'>
          <SignedIn>
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className='flex items-center gap-2'>
                <Button variant="outline">
                  <item.icon size={18} />
                  <span className='hidden md:block'>{item.label}</span>
                </Button>
              </Link>
            ))}
            <UserButton appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }} />
          </SignedIn>
        </div>
      </nav>
    </div>
  )
}