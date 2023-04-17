import React from 'react'

export const SkeletonText = () => {
  return (
    <div role='status' className='animate-pulse'>
      <div className='h-2.5 bg-surface1 rounded-full w-2/3 mb-4'></div>
      <div className='h-2 bg-surface1 rounded-full max-w-[360px] mb-2.5'></div>
      <div className='h-2 bg-surface1 rounded-full max-w-[330px] mb-2.5'></div>
    </div>
  )
}
