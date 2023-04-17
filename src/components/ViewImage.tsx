/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'

export const ViewImage = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className='bg-black fixed inset-0 opacity-70' />
      <Dialog.Content className='fixed top-[50%] left-[50%] max-h-[85vh] w-fit translate-x-[-50%] translate-y-[-50%] rounded-md focus:outline-none'>
        <Dialog.Close className='absolute right'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            fill='#FFF'
            viewBox='0 0 256 256'
          >
            <path d='M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z'></path>
          </svg>
        </Dialog.Close>

        <div>
          <img
            src={imageUrl}
            className='max-w-[700px] max-h-[600px] object-cover p-10'
            alt='Image view'
          />
        </div>

        <footer className='h-4 w-full p-2 text-surface2 flex items-center justify-center rounded-md'>
          <Link className='underline' href={imageUrl} target='_blank'>
            Ver original
          </Link>
        </footer>

        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Portal>
  )
}
