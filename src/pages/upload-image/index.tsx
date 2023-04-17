import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowBendUpLeft } from 'phosphor-react'
import { TextInput } from '@/components/input/TextInput'
import { FileInput } from '@/components/input/FileInput'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'

import * as Toast from '@radix-ui/react-toast'

import { zodResolver } from '@hookform/resolvers/zod'

import * as z from 'zod'
import { ToastSuccess } from '@/components/toast'
import { validateImageType } from '@/utils/validateImageType'

type dataImageInput = {
  title: string
  description: string
  url: string
}

const imageUpLoadFormSchema = z.object({
  title: z.string().nonempty('Campo obrigatorio'),
  description: z.string().nonempty('Campo obrigatorio'),
  image: z
    .any()
    .transform((list) => list.item(0))
    .refine(
      (file) => file?.size <= 10 * 1024 * 1024,
      'Arquivo deve ser menor que 10MB',
    )
    .refine(
      (file) => validateImageType(file?.type),
      'Selecione apenas JPEG, PNG ou GIF',
    ),
})

type ImageUploadFormSchema = z.infer<typeof imageUpLoadFormSchema>

export default function UploadImage() {
  const [imageUrl, setImageUrl] = useState('')
  const [localImageUrl, setLocalImageUrl] = useState('')
  const [openToast, setOpenToast] = useState(false)
  const timerRef = React.useRef(0)

  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (data: dataImageInput) => await api.post('/api/images', data),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['images'])
      },
    },
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setError,
    trigger,
  } = useForm({ resolver: zodResolver(imageUpLoadFormSchema) })

  const onSubmit = async (data: ImageUploadFormSchema) => {
    try {
      if (!imageUrl) throw new Error('No Image')

      const { description, title } = data

      await mutation.mutateAsync({
        description,
        title,
        url: imageUrl,
      })

      setOpenToast(true)
      reset()
    } catch (err) {
      console.error(err)
    } finally {
      setImageUrl('')
      setLocalImageUrl('')
    }
  }

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <div className='max-w-[1080px] m-auto px-4'>
      <header className='py-6'>
        <Link className='flex items-center w-32 gap-2 text-xl' href='/'>
          <ArrowBendUpLeft size={22} />
          <span>Voltar</span>
        </Link>
      </header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='bg-base flex flex-col gap-4 w-full'>
          <FileInput
            setImageUrl={setImageUrl}
            setLocalImageUrl={setLocalImageUrl}
            localImageUrl={localImageUrl}
            setError={setError}
            trigger={trigger}
            error={errors.image}
            {...register('image')}
          />

          <TextInput
            placeholder='Titulo da imagem'
            error={errors.title}
            {...register('title')}
          />

          <TextInput
            placeholder='Descrição da imagem'
            error={errors.description}
            {...register('description')}
          />

          <Toast.Provider swipeDirection='right'>
            <button
              className='bg-red text-base font-semibold text-lg rounded-lg w-full py-4 px-6 disabled:cursor-not-allowed disabled:opacity-50'
              type='submit'
              onClick={() => {
                if (!isValid) return
                setOpenToast(false)
                window.clearTimeout(timerRef.current)
                timerRef.current = window.setTimeout(() => {
                  setOpenToast(true)
                }, 100)
              }}
            >
              Enviar
            </button>

            <ToastSuccess open={openToast} setOpenToast={setOpenToast} />
            <Toast.Viewport className='[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none' />
          </Toast.Provider>
        </div>
      </form>
    </div>
  )
}
