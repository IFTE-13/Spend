import Link from 'next/link'
import React from 'react'

export const Footer = () => {
  return (
    <div className="h-12 w-full p-4 bg-black">
        <p className='text-center text-white'>
        made by 
        <Link 
        href={"https://github.com/ifte-13"} 
        target='_blank' 
        className='hover:underline mx-1'>
            Ifte-13
        </Link>
        </p>
    </div>
  )
}
