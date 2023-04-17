import Image from 'next/image'
import { useMemo } from 'react'
import { api } from '@/services/api'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Header } from '@/components/header'
import { ImageList } from '@/components/ImageList'
import Head from 'next/head'
import { FileImage } from 'phosphor-react'

type fetchImagesParams = {
  pageParam?: string | null
}

type Image = {
  title: string
  description: string
  url: string
  ts: number
  id: string
}

type AxiosResponse = {
  data: Image[]
  after: string | null
}

const fetchImages = async ({ pageParam = null }: fetchImagesParams) => {
  const data = await api.get<AxiosResponse>('/api/images', {
    params: {
      after: pageParam,
    },
  })

  return data
}

export default function Home() {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(['images'], fetchImages, {
    getNextPageParam: (lastPage) => lastPage.data.after ?? null,
  })

  const formattedData = useMemo(() => {
    return data?.pages.flatMap((image) => image.data.data)
  }, [data]) as Image[]

  if (isLoading) return null
  if (isError) return null

  return (
    <>
      <Head>
        <title>Image DB</title>
      </Head>

      <Header />

      <div className='max-w-[1080px] m-auto my-2 px-4'>
        {formattedData.length === 0 ? (
          <div className='flex flex-col items-center justify-center text-surface2 mt-20'>
            <h2 className='text-3xl'>No Images</h2>
            <FileImage size={200} />
          </div>
        ) : (
          <>
            <ImageList images={formattedData} />

            {hasNextPage ? (
              <button
                className='mt-10 text-pink text-lg underline py-2 rounded-md'
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
              </button>
            ) : null}
          </>
        )}
      </div>
    </>
  )
}
