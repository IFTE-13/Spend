import React from 'react'
import { Navbar } from '../components/Navbar';

const AppLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <>
        <Navbar />
        <div className='mx-auto container my-8'>
          {children}
        </div>
    </>
  )
}

export default AppLayout