import React from 'react'
import { ImageCard } from './ImageCard'

interface Image {
  title: string
  description: string
  url: string
  ts: number
  id: string
}

interface ImagesProps {
  images: Image[]
}

export const ImageList = ({ images }: ImagesProps) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {images.map((image) => (
        <ImageCard key={image.id} data={image} />
      ))}
    </div>
  )
}
