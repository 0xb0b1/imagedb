import React, { forwardRef } from 'react'

const TextInputBase = ({ name, error = null, ...rest }, ref) => {
  return (
    <div className='relative flex flex-col w-full'>
      <input
        aria-label={name}
        name={name}
        ref={ref}
        className={`bg-surface0 shadow-lg shadow-base ${
          !!error ? 'border-2 border-red' : ''
        } text-pink placeholder-text rounded-lg py-4 px-6`}
        {...rest}
      />

      {!!error ? (
        <span className='absolute right-4 top-2 text-lg'>*</span>
      ) : null}
    </div>
  )
}

export const TextInput = forwardRef(TextInputBase)
