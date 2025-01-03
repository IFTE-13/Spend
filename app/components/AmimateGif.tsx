import Image, { StaticImageData } from 'next/image';
import React from 'react';

type AmimateGifProps = {
  src: string | StaticImageData;
  alt: string;
};

const AmimateGif = ({ src, alt }: AmimateGifProps) => {
  return (
    <Image
      src={src}
      alt={alt}
    />
  );
};

export default AmimateGif;
