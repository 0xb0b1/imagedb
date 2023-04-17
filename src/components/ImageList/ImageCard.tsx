/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { SkeletonText } from '../SkeletonText'

import * as Dialog from '@radix-ui/react-dialog'
import { ViewImage } from '../ViewImage'

interface Image {
  title: string
  description: string
  url: string
  ts: number
}

interface ImageProps {
  data: Image
}

export const ImageCard = ({ data }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div
      key={data.ts}
      className='rounded-md bg-surface0 text-flamingo shadow-ld shadow-base'
    >
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <img
            className='object-cover w-full h-48 rounded-md cursor-pointer p-1'
            src={data.url}
            alt={data.title}
            loading='lazy'
            onLoad={() => setIsLoading(false)}
          />
        </Dialog.Trigger>

        <ViewImage imageUrl={data.url} />
      </Dialog.Root>
      <div className='pt-5 pb-4 px-6'>
        {isLoading ? (
          <SkeletonText />
        ) : (
          <>
            <h2 className='text-2xl text-mauve font-semibold'>{data.title}</h2>
            <span className='text-md'>{data.description.slice(0, 50)}...</span>
          </>
        )}
      </div>
    </div>
  )
}
