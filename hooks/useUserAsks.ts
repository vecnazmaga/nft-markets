import { paths } from '@reservoir0x/client-sdk/dist/types/api'
import fetcher from 'lib/fetcher'
import setParams from 'lib/params'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite'
import useSearchCommunity from './useSearchCommunity'

const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY
const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION

type Orders = paths['/orders/asks/v2']['get']['responses']['200']['schema']

export default function useUserAsks(
  fallbackData: Orders[],
  user: string | undefined,
  collections: ReturnType<typeof useSearchCommunity>
) {
  const { ref, inView } = useInView()

  const pathname = `${PROXY_API_BASE}/orders/asks/v2`

  const orders = useSWRInfinite<Orders>(
    (index, previousPageData) =>
      getKey(
        { pathname, proxyApi: PROXY_API_BASE, user, collections },
        index,
        previousPageData
      ),
    fetcher,
    {
      revalidateFirstPage: false,
      fallbackData,
    }
  )

  // Fetch more data when component is visible
  useEffect(() => {
    if (inView) {
      orders.setSize(orders.size + 1)
    }
  }, [inView])

  return { orders, ref }
}

type InfiniteKeyLoader = (
  custom: {
    pathname: string
    proxyApi: string | undefined
    user: string | undefined
    collections: ReturnType<typeof useSearchCommunity>
  },
  ...base: Parameters<SWRInfiniteKeyLoader>
) => ReturnType<SWRInfiniteKeyLoader>

const getKey: InfiniteKeyLoader = (
  custom: {
    pathname: string
    proxyApi: string | undefined
    user: string | undefined
    collections: ReturnType<typeof useSearchCommunity>
  },
  index: number,
  previousPageData: Orders
) => {
  const { pathname, proxyApi, user, collections } = custom

  if (!proxyApi) {
    console.debug(
      'Environment variable NEXT_PUBLIC_PROXY_API_BASE is undefined.'
    )
    return null
  }

  // Reached the end
  if (previousPageData && !previousPageData?.continuation) return null

  let query: paths['/orders/asks/v2']['get']['parameters']['query'] = {
    status: 'active',
    maker: user,
    limit: 20,
  }

  // @ts-ignore
  if (COLLECTION && !COMMUNITY) query.contracts = COLLECTION

  if (COMMUNITY) {
    collections?.data?.collections
      ?.map(({ contract }) => contract)
      .filter((contract) => !!contract)
      // @ts-ignore
      .forEach((contract, index) => (query[`contracts[${index}]`] = contract))
  }

  if (previousPageData) query.continuation = previousPageData.continuation

  const href = setParams(pathname, query)

  return href
}
