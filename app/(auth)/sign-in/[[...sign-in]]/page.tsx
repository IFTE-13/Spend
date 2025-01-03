import { SignIn } from '@clerk/nextjs'
import React from 'react'

export default function Auth() {
  return (
    <div className='flex justify-center items-center h-full min-h-screen'>
      <SignIn />
    </div>
  );
}