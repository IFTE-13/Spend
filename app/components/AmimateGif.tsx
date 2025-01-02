import Image from 'next/image'
import React from 'react'

const AmimateGif = ({src, alt} : any) => {
  return (
    <Image
        src={src}
        alt={alt}
    />
  )
}

export default AmimateGif