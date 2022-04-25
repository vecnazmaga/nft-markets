import useCollection from 'hooks/useCollection'
import useDetails from 'hooks/useDetails'
import getMode from 'lib/getMode'
import { optimizeImage } from 'lib/optmizeImage'
import Link from 'next/link'
import React, { FC } from 'react'

type Props = {
  collection: ReturnType<typeof useCollection>
  details: ReturnType<typeof useDetails>
  mode: ReturnType<typeof getMode>['mode']
}

const CollectionInfo: FC<Props> = ({ collection, mode, details }) => {
  const token = details.data?.tokens?.[0]

  const tokenDescription =
    token?.token?.description ||
    collection.data?.collection?.metadata?.description

  return (
    <article className="col-span-full rounded-2xl border border-gray-300 bg-white p-6">
      <div className="reservoir-h5 mb-4">Collection Info</div>
      <Link
        href={
          mode === 'collection'
            ? '/'
            : `/collections/${collection.data?.collection?.id}`
        }
      >
        <a className="inline-flex items-center gap-2">
          <img
            src={optimizeImage(
              collection.data?.collection?.metadata?.imageUrl as string,
              50
            )}
            alt="collection avatar"
            className="h-9 w-9 rounded-full"
          />
          <span className="reservoir-h6">{token?.token?.collection?.name}</span>
        </a>
      </Link>
      {tokenDescription && (
        <div className="reservoir-body-2 mt-4">
          {/* @ts-ignore */}
          {tokenDescription}
        </div>
      )}
    </article>
  )
}

export default CollectionInfo
