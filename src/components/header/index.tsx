import Link from 'next/link'
import { UploadSimple } from 'phosphor-react'
import React, { useState } from 'react'

export const Header = () => {
  return (
    <>
      <header className='max-w-[1080px] m-auto px-4'>
        <div className='bg-base flex items-center justify-between py-6'>
          <h2 className='font-bold font-sans text-2xl'>&lt;ImageDB /&gt;</h2>
          <Link href='/upload-image'>
            <button className='flex items-center gap-4 bg-mauve text-mantle border-none rounded-md p-4'>
              <UploadSimple size={22} weight='bold' />
              <span>Adicionar imagem</span>
            </button>
          </Link>
        </div>
      </header>
    </>
  )
}
