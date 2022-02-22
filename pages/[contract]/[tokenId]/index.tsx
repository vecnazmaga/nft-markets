import Layout from 'components/Layout'
import { paths } from 'interfaces/apiTypes'
import fetcher from 'lib/fetcher'
import { optimizeImage } from 'lib/optmizeImage'
import setParams from 'lib/params'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { FC, ReactNode, useState } from 'react'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import ListModal from 'components/ListModal'
import FormatEth from 'components/FormatEth'
import TokenAttributes from 'components/TokenAttributes'
import TokenOfferModal from 'components/TokenOfferModal'
import CancelListing from 'components/CancelListing'
import CancelOffer from 'components/CancelOffer'
import AcceptOffer from 'components/AcceptOffer'
import BuyNow from 'components/BuyNow'
import EthAccount from 'components/EthAccount'
import Link from 'next/link'
import useDataDog from 'hooks/useAnalytics'
import Head from 'next/head'
import getMode from 'lib/getMode'

const apiBase = process.env.NEXT_PUBLIC_API_BASE
const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
const collectionEnv = process.env.NEXT_PUBLIC_COLLECTION
const communityEnv = process.env.NEXT_PUBLIC_COMMUNITY
const openSeaApiKey = process.env.NEXT_PUBLIC_OPENSEA_API_KEY

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const Index: NextPage<Props> = ({ collectionId, mode }) => {
  const [{ data: accountData }] = useAccount()
  const [{ data: signer }] = useSigner()
  const [{ data: network }] = useNetwork()
  const router = useRouter()
  useDataDog(accountData)
  const [error, setError] = useState(false)

  let url = new URL('/tokens/details', apiBase)

  let query: paths['/tokens/details']['get']['parameters']['query'] = {
    contract: router.query?.contract?.toString(),
    tokenId: router.query?.tokenId?.toString(),
  }

  setParams(url, query)

  const details = useSWR<
    paths['/tokens/details']['get']['responses']['200']['schema']
  >(url.href, fetcher)

  const collectionUrl = new URL(`/collections/${collectionId}`, apiBase)

  const collection = useSWR<
    paths['/collections/{collection}']['get']['responses']['200']['schema']
  >(collectionUrl.href, fetcher)

  if (details.error || !apiBase || !chainId) {
    console.debug({ apiBase, chainId })
    return <div>There was an error</div>
  }

  const token = details.data?.tokens?.[0]
  const isOwner =
    token?.token?.owner?.toLowerCase() === accountData?.address.toLowerCase()
  const isTopBidder =
    !!accountData &&
    token?.market?.topBuy?.maker?.toLowerCase() ===
      accountData?.address?.toLowerCase()
  const isListed = token?.market?.floorSell?.value !== null
  const isInTheWrongNetwork = signer && network.chain?.id !== +chainId

  const data = {
    collection: {
      name: collection.data?.collection?.collection?.name,
    },
    token: {
      contract: token?.token?.contract,
      id: token?.token?.tokenId,
      image: token?.token?.image,
      name: token?.token?.name,
      topBuyValue: token?.market?.topBuy?.value,
      floorSellValue: token?.market?.floorSell?.value,
    },
  }

  return (
    <Layout>
      <Head>
        {mode === 'global' ? (
          <title>
            {token?.token?.name || `#${token?.token?.tokenId}`} -{' '}
            {collection.data?.collection?.collection?.name} | Reservoir Market
          </title>
        ) : (
          <title>
            {token?.token?.name || `#${token?.token?.tokenId}`} -{' '}
            {collection.data?.collection?.collection?.name} Marketplace |
            Powered by Reservoir
          </title>
        )}
        <meta
          name="description"
          content={collection.data?.collection?.collection?.description}
        />
        <meta name="twitter:image" content={token?.token?.image} />
        <meta property="og:image" content={token?.token?.image} />
      </Head>
      <div className="mb-2 grid place-items-center sm:mb-12 sm:mt-10 sm:grid-cols-2 sm:gap-10">
        <div className="mt-5 flex gap-3 sm:hidden">
          <img
            src={optimizeImage(
              collection.data?.collection?.collection?.image,
              50
            )}
            alt="collection avatar"
            className="h-[50px] w-[50px] rounded-full"
          />
          <div>
            <Link href={`/collections/${collectionId}`}>
              <a className="mb-1 block  text-2xl font-bold">
                {token?.token?.collection?.name}
              </a>
            </Link>
            <div className="mb-4 text-lg font-medium uppercase opacity-80">
              {token?.token?.name || `#${token?.token?.tokenId}`}
            </div>
          </div>
        </div>
        <div className="mb-6 sm:ml-auto sm:mb-0 sm:self-start">
          <img
            className="mb-4 w-[500px]"
            src={optimizeImage(token?.token?.image, 500)}
          />
          <div className="mb-3 w-min ">
            {token?.token?.owner && (
              <Link href={`/address/${token.token.owner}`}>
                <a className="block">
                  <EthAccount address={token.token.owner} title="owner" />
                </a>
              </Link>
            )}
          </div>
        </div>

        <div className="mb-8 sm:mr-auto sm:self-start">
          <div className="hidden gap-3 sm:flex">
            <img
              src={optimizeImage(
                collection.data?.collection?.collection?.image,
                50
              )}
              alt="collection avatar"
              className="h-[50px] w-[50px] rounded-full"
            />
            <div>
              <Link
                href={
                  mode === 'collection' ? '/' : `/collections/${collectionId}`
                }
              >
                <a className="mb-1 block text-2xl font-bold">
                  {token?.token?.collection?.name}
                </a>
              </Link>
              <div className="mb-4 text-lg font-medium opacity-80">
                {token?.token?.name || `#${token?.token?.tokenId}`}
              </div>
            </div>
          </div>
          <div className="mb-5 rounded-md border border-neutral-200 p-6">
            <div className="grid grid-cols-2 gap-8">
              <Price
                title="list price"
                price={
                  <FormatEth
                    amount={token?.market?.floorSell?.value}
                    maximumFractionDigits={4}
                    logoWidth={12}
                  />
                }
              >
                {isOwner && (
                  <ListModal
                    signer={signer}
                    apiBase={apiBase}
                    chainId={+chainId}
                    maker={accountData?.address}
                    collection={collection.data}
                    details={details}
                  />
                )}
                <BuyNow
                  apiBase={apiBase}
                  details={details}
                  data={data}
                  signer={signer}
                  isInTheWrongNetwork={isInTheWrongNetwork}
                  setError={setError}
                  show={!isOwner}
                />
              </Price>
              <Price
                title="top offer"
                price={
                  <FormatEth
                    amount={token?.market?.topBuy?.value}
                    maximumFractionDigits={4}
                    logoWidth={12}
                  />
                }
              >
                <AcceptOffer
                  apiBase={apiBase}
                  details={details}
                  data={data}
                  signer={signer}
                  show={isOwner}
                  isInTheWrongNetwork={isInTheWrongNetwork}
                />
                {!isOwner && (
                  <TokenOfferModal
                    signer={signer}
                    data={data}
                    royalties={{
                      bps: collection.data?.collection?.royalties?.bps,
                      recipient:
                        collection.data?.collection?.royalties?.recipient,
                    }}
                    env={{
                      apiBase,
                      chainId: +chainId as ChainId,
                      openSeaApiKey,
                    }}
                    details={details}
                  />
                )}
              </Price>
            </div>
            {error && (
              <div className="mx-auto mt-4 rounded border border-red-400 bg-red-100 py-1 px-2 text-red-900">
                You have insufficient funds to buy this token.
              </div>
            )}
            <CancelOffer
              apiBase={apiBase}
              details={details}
              data={data}
              signer={signer}
              show={isTopBidder}
              isInTheWrongNetwork={isInTheWrongNetwork}
            />
            <CancelListing
              apiBase={apiBase}
              data={data}
              signer={signer}
              details={details}
              show={isOwner && isListed}
              isInTheWrongNetwork={isInTheWrongNetwork}
            />
          </div>
          <TokenAttributes token={token?.token} />
        </div>
      </div>
    </Layout>
  )
}

export default Index

const Price: FC<{ title: string; price: ReactNode }> = ({
  title,
  price,
  children,
}) => (
  <div className="grid justify-items-center space-y-5">
    <div className="text-center font-medium uppercase opacity-75">{title}</div>
    <div className="text-3xl font-bold">{price}</div>
    {children}
  </div>
)

export const getServerSideProps: GetServerSideProps<{
  collectionId: string
  mode: string
}> = async ({ req, params }) => {
  const { mode } = getMode(req, communityEnv, collectionEnv)

  // GET token details
  const url = new URL('/tokens/details', apiBase)

  const query: paths['/tokens/details']['get']['parameters']['query'] = {
    contract: params?.contract?.toString(),
    tokenId: params?.tokenId?.toString(),
  }

  setParams(url, query)

  const res = await fetch(url.href)

  const tokenDetails =
    (await res.json()) as paths['/tokens/details']['get']['responses']['200']['schema']

  const collectionId = tokenDetails.tokens?.[0].token?.collection?.id

  if (!collectionId) {
    return {
      notFound: true,
    }
  }

  return { props: { collectionId, mode } }
}
