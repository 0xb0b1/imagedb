/* eslint-disable @next/next/no-img-element */
import React, {
  useState,
  SetStateAction,
  Dispatch,
  ForwardRefRenderFunction,
  forwardRef,
  useCallback,
  useEffect,
} from 'react'

import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormSetError,
  UseFormTrigger,
} from 'react-hook-form'
import { api } from '@/services/api'
import { ImageSquare } from 'phosphor-react'

import * as Progress from '@radix-ui/react-progress'

interface FileInputProps {
  name: string
  error?: Merge<FieldError, FieldErrorsImpl<any>> | any
  setImageUrl: Dispatch<SetStateAction<string>>
  localImageUrl: string
  setLocalImageUrl: Dispatch<SetStateAction<string>>
  setError: UseFormSetError<FieldValues>
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => Promise<boolean | void>
  trigger: UseFormTrigger<FieldValues>
}

const FileInputBase: ForwardRefRenderFunction<
  HTMLInputElement,
  FileInputProps
> = (
  {
    name,
    error = null,
    setImageUrl,
    localImageUrl,
    setLocalImageUrl,
    setError,
    onChange,
    trigger,
    ...rest
  },
  ref,
) => {
  const [progress, setProgress] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [cancelToken, setCancelToken] = useState<CancelTokenSource>(
    {} as CancelTokenSource,
  )

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      if (!event.target.files?.length) return

      setImageUrl('')
      setLocalImageUrl('')
      setError('image', {})
      setIsSending(true)

      await onChange(event)
      trigger('image')

      const formData = new FormData()

      formData.append(event.target.name, event.target.files[0])
      formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY as string)

      const { CancelToken } = axios
      const source = CancelToken.source()
      setCancelToken(source)

      const config = {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress: (e: ProgressEvent) => {
          setProgress(Math.round((e.loaded * 100) / e.total))
        },
        cancelToken: source.token,
      } as AxiosRequestConfig | any

      try {
        const response = await api.post(
          'https://api.imgbb.com/1/upload',
          formData,
          config,
        )

        setImageUrl(response.data.data.url)
        setLocalImageUrl(URL.createObjectURL(event.target.files[0]))
      } catch (err: any) {
        if (err?.message === 'Cancelled image upload.') return

        console.log('falha ao enviar')
      } finally {
        setIsSending(false)
        setProgress(0)
      }
    },
    [onChange, setError, setImageUrl, setLocalImageUrl, trigger],
  )

  useEffect(() => {
    if (error?.message && isSending && cancelToken?.cancel) {
      cancelToken.cancel('Cancelled image upload.')
      // setCancelToken({})
    }
  }, [cancelToken, error, isSending])

  return (
    <div className='flex h-80 w-full bg-surface0 shadow-lg shadow-base rounded-md relative'>
      <label
        htmlFor={name}
        className={`mx-auto w-full flex justify-center ${
          isSending
            ? 'cursor-progress opacity-50'
            : 'cursor-pointer opacity-100'
        }`}
      >
        {localImageUrl && !isSending ? (
          <img
            className='h-80 p-4 object-cover'
            src={localImageUrl}
            alt='Uploaded photo'
          />
        ) : (
          <div
            className={`flex w-full h-full flex-col justify-center items-center ${
              error?.message && 'border-2 border-red'
            } rounded-md text-text`}
          >
            {isSending ? (
              <>
                <Progress.Root
                  className='relative overflow-hidden bg-surface2 rounded-full w-[300px] h-[25px]'
                  value={progress}
                >
                  <Progress.Indicator
                    className='bg-peach w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65,0,0.35,1)]'
                    style={{ transform: `translateX(-${100 - progress}%)` }}
                  />
                </Progress.Root>
                <span>Carregando...</span>
              </>
            ) : (
              <div className='h-full w-full flex items-center justify-center flex-col'>
                <ImageSquare size={32} />
                <span>Adicione sua imagem</span>
              </div>
            )}
          </div>
        )}
        <input
          data-testid={name}
          accept='image/*'
          className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
          disabled={isSending}
          id={name}
          name={name}
          onChange={handleImageUpload}
          ref={ref}
          type='file'
          draggable='true'
          {...rest}
        />
        {!!error ? <span className='absolute'>{error?.message}</span> : null}
      </label>
    </div>
  )
}

export const FileInput = forwardRef(FileInputBase)
