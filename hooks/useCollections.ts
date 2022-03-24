import { paths } from '@reservoir0x/client-sdk'
import fetcher from 'lib/fetcher'
import setParams from 'lib/params'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite'

type Collections = paths['/collections/v2']['get']['responses']['200']['schema']

export default function useCollections(apiBase: string | undefined) {
  const { ref, inView } = useInView()

  const collectionsUrl = new URL('/collections/v2', apiBase)

  const collections = useSWRInfinite<Collections>(
    (index, previousPageData) =>
      getKey(collectionsUrl, index, previousPageData),
    fetcher,
    {
      revalidateFirstPage: false,
    }
  )

  // Fetch more data when component is visible
  useEffect(() => {
    if (inView) {
      collections.setSize(collections.size + 1)
    }
  }, [inView])

  return { collections, ref }
}

const getKey: (
  url: URL,
  ...base: Parameters<SWRInfiniteKeyLoader>
) => ReturnType<SWRInfiniteKeyLoader> = (
  url: URL,
  index: number,
  previousPageData: paths['/collections/v2']['get']['responses']['200']['schema']
) => {
  // Reached the end
  if (previousPageData && previousPageData?.collections?.length === 0)
    return null

  let query: paths['/collections/v2']['get']['parameters']['query'] = {
    limit: 20,
    offset: index * 20,
    sortBy: '1DayVolume',
  }

  setParams(url, query)

  return url.href
}
