import useCollections from 'hooks/useCollections'
import Head from 'next/head'
import React, { FC } from 'react'
import CollectionsGrid from './CollectionsGrid'
import SearchCollection from './SearchCollections'

type Props = {
  apiBase: string
}

const Homepage: FC<Props> = ({ apiBase }) => {
  const collections = useCollections(apiBase)
  return (
    <>
      <Head>
        <title>
          Reservoir Market | Open source NFT marketplace powered by Reservoir
        </title>
        <meta
          name="description"
          content="Reservoir Market is an open source NFT marketplace powered by Reservoir"
        />
      </Head>
      <header className="col-span-full mb-10 mt-40">
        <h1 className="reservoir-h1 text-center">
          Discover, buy and sell NFTs
        </h1>
      </header>
      <div className="col-span-full mb-12 md:col-span-4 md:col-start-3 lg:col-span-4 lg:col-start-5">
        <SearchCollection />
      </div>
      <CollectionsGrid collections={collections} />
    </>
  )
}

export default Homepage
