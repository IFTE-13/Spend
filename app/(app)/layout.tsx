import React from 'react'

const AppLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
      <div className='mx-auto container my-8'>
        {children}
      </div>
  )
}

export default AppLayout