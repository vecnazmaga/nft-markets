import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Downshift from 'downshift'
import { useRouter } from 'next/router'
import setParams from 'lib/params'
import debounce from 'lodash.debounce'
import { FiSearch, FiXCircle } from 'react-icons/fi'
import { paths } from '@reservoir0x/client-sdk'

type Props = {
  communityId?: string
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE

const SearchCollections: FC<Props> = ({ communityId }) => {
  const router = useRouter()
  const [focused, setFocused] = useState<boolean>(false)
  const [results, setResults] = useState<
    paths['/collections/v2']['get']['responses']['200']['schema']
  >({})
  const [initialResults, setInitialResults] = useState<
    paths['/collections/v2']['get']['responses']['200']['schema']
  >({})

  // LOAD INITIAL RESULTS
  useEffect(() => {
    if (!apiBase) return

    const url = new URL('/collections/v2', apiBase)

    const query: paths['/collections/v2']['get']['parameters']['query'] = {
      sortBy: 'allTimeVolume',
    }

    if (communityId && communityId !== 'www' && communityId !== 'localhost')
      query['community'] = communityId

    setParams(url, query)

    async function initialData(url: URL) {
      const res = await fetch(url.href)

      const json =
        (await res.json()) as paths['/collections/v2']['get']['responses']['200']['schema']

      setResults({ collections: json.collections })
      setInitialResults({ collections: json.collections })
    }

    initialData(url)
  }, [apiBase, communityId])

  const [count, setCount] = useState(0)
  const countRef = useRef(count)
  countRef.current = count

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      if (value === '') {
        setResults({})
        return
      }
      // Fetch new results
      setCount(countRef.current)

      if (communityId && communityId !== 'www' && communityId !== 'localhost') {
        query.community = communityId
      }

      query.name = value

      setParams(url, query)

      try {
        const res = await fetch(url.href)

        const data =
          (await res.json()) as paths['/collections/v2']['get']['responses']['200']['schema']

        if (!data) throw new ReferenceError('Data does not exist.')

        setResults({ collections: data.collections })
      } catch (err) {
        console.error(err)
      }
    }, 700),
    []
  )

  const url = new URL('/collections/v2', apiBase)

  const query: paths['/collections/v2']['get']['parameters']['query'] = {
    sortBy: 'allTimeVolume',
  }

  const isEmpty = results?.collections?.length === 0

  return (
    <Downshift
      onInputValueChange={(value) => debouncedSearch(value)}
      id="search-bar-downshift"
      onChange={(item) => item.id && router.push(`/collections/${item.id}`)}
      itemToString={(item) => (item ? item.name : '')}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        inputValue,
        reset,
      }) => (
        <div
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="relative"
        >
          <FiSearch
            className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#4b5563] ${
              focused ? 'text-[#9CA3AF]' : ''
            }`}
          />
          <input
            type="text"
            className="reservoir-label-l input-primary-outline w-full pl-9"
            placeholder="Search for a collection"
            {...getInputProps()}
          />
          {typeof inputValue === 'string' && inputValue !== '' && (
            <button
              onClick={() => {
                reset()
                setFocused(false)
              }}
            >
              <FiXCircle className="absolute top-1/2 right-3 z-20 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            </button>
          )}

          {(focused || isOpen) &&
            inputValue === '' &&
            initialResults?.collections &&
            initialResults?.collections.length > 0 && (
              <div
                className="absolute top-[50px] z-10 w-full divide-y-[1px] divide-[#D1D5DB] overflow-hidden rounded-[8px] border border-[#D1D5DB] bg-white"
                {...getMenuProps()}
              >
                {initialResults?.collections
                  ?.filter((collection) => {
                    if (collection.tokenCount) {
                      return +collection.tokenCount <= 30000
                    }
                    return false
                  })
                  .slice(0, 6)
                  .map((collection, index) => (
                    <Link
                      key={collection?.name}
                      href={`/collections/${collection?.id}`}
                    >
                      <a
                        {...getItemProps({
                          key: collection?.name,
                          index,
                          item: collection,
                        })}
                        onClick={() => {
                          reset()
                          setFocused(false)
                        }}
                        className={`flex items-center p-4 hover:bg-[#F3F4F6] ${
                          highlightedIndex === index ? 'bg-[#F3F4F6]' : ''
                        }`}
                      >
                        <img
                          src={
                            // @ts-ignore
                            collection?.metadata?.imageUrl ??
                            'https://via.placeholder.com/30'
                          }
                          alt={`${collection?.name}'s logo.`}
                          className="h-9 w-9 overflow-hidden rounded-full"
                        />
                        <span className="reservoir-subtitle ml-2">
                          {collection?.name}
                        </span>
                      </a>
                    </Link>
                  ))}
              </div>
            )}
          {(focused || isOpen) && inputValue !== '' && isEmpty && (
            <div
              className="absolute top-[50px] z-10 w-full divide-y-[1px] divide-[#D1D5DB] overflow-hidden rounded-[8px] border border-[#D1D5DB] bg-white"
              {...getMenuProps()}
            >
              <div className="flex items-center p-4">No collections found</div>
            </div>
          )}
          {(focused || isOpen) && inputValue !== '' && !isEmpty && (
            <div
              className="absolute top-[50px] z-10 w-full divide-y-[1px] divide-[#D1D5DB] overflow-hidden rounded-[8px] border border-[#D1D5DB] bg-white"
              {...getMenuProps()}
            >
              {results?.collections
                ?.filter((collection) => {
                  if (collection.tokenCount) {
                    return +collection.tokenCount <= 30000
                  }
                  return false
                })
                .slice(0, 6)
                .map((collection, index) => (
                  <Link
                    key={collection?.name}
                    href={`/collections/${collection?.id}`}
                  >
                    <a
                      {...getItemProps({
                        key: collection?.name,
                        index,
                        item: collection,
                      })}
                      onClick={() => {
                        reset()
                        setFocused(false)
                      }}
                      className={`flex items-center p-4 hover:bg-[#F3F4F6] ${
                        highlightedIndex === index ? 'bg-[#F3F4F6]' : ''
                      }`}
                    >
                      <img
                        src={
                          // @ts-ignore
                          collection?.metadata?.imageUrl ??
                          'https://via.placeholder.com/30'
                        }
                        alt={`${collection?.name}'s logo.`}
                        className="h-9 w-9 overflow-hidden rounded-full"
                      />
                      <span className="reservoir-subtitle ml-2">
                        {collection?.name}
                      </span>
                    </a>
                  </Link>
                ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  )
}

export default SearchCollections
