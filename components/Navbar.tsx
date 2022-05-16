import { FC, ReactElement, useEffect, useState } from 'react'
import ConnectWallet from './ConnectWallet'
import Link from 'next/link'
import HamburgerMenu from './HamburgerMenu'
import dynamic from 'next/dynamic'
import { paths } from '@reservoir0x/client-sdk'
import setParams from 'lib/params'

const SearchCollections = dynamic(() => import('./SearchCollections'))
const CommunityDropdown = dynamic(() => import('./CommunityDropdown'))
const NAVBAR_TITLE = process.env.NEXT_PUBLIC_NAVBAR_TITLE
const NAVBAR_LOGO = process.env.NEXT_PUBLIC_NAVBAR_LOGO
const EXTERNAL_LINKS = process.env.NEXT_PUBLIC_EXTERNAL_LINKS || null
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY

function getInitialSearchHref() {
  const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE
  const pathname = `${PROXY_API_BASE}/search/collections/v1`
  const query: paths['/search/collections/v1']['get']['parameters']['query'] =
    {}

  if (COMMUNITY) {
    query.community = COMMUNITY
  }

  return setParams(pathname, query)
}

const Navbar: FC = () => {
  const [filterComponent, setFilterComponent] = useState<ReactElement | null>(
    null
  )
  const logo = NAVBAR_LOGO || '/reservoir.svg'
  const logoAlt = `${NAVBAR_TITLE} Logo` || 'Reservoir Logo'

  const externalLinks: { name: string; url: string }[] = []

  if (typeof EXTERNAL_LINKS === 'string') {
    const linksArray = EXTERNAL_LINKS.split(',')

    linksArray.forEach((link) => {
      let values = link.split('::')
      externalLinks.push({
        name: values[0],
        url: values[1],
      })
    })
  }

  const hasExternalLinks = externalLinks.length > 0

  const isGlobal = !COMMUNITY && !COLLECTION
  const filterableCollection = isGlobal || COMMUNITY

  useEffect(() => {
    if (filterableCollection) {
      const href = getInitialSearchHref()

      fetch(href).then(async (res) => {
        let initialResults = undefined

        if (res.ok) {
          initialResults =
            (await res.json()) as paths['/search/collections/v1']['get']['responses']['200']['schema']
        }

        const smallCommunity =
          initialResults?.collections &&
          initialResults.collections.length >= 2 &&
          initialResults.collections.length <= 10

        if (COMMUNITY && smallCommunity) {
          setFilterComponent(
            <CommunityDropdown collections={initialResults?.collections} />
          )
        } else {
          setFilterComponent(
            <SearchCollections
              communityId={COMMUNITY}
              initialResults={initialResults}
            />
          )
        }
      })
    }
  }, [filterableCollection])

  return (
    <nav className="col-span-full flex items-center justify-between gap-2 px-6 py-4 md:gap-3 md:py-6 md:px-16">
      <Link href="/">
        <a className="relative inline-flex flex-none items-center gap-1">
          <img src={logo} alt={logoAlt} className="w-8" />
          {NAVBAR_TITLE ? (
            <div className="hidden font-semibold dark:text-white md:block">
              {NAVBAR_TITLE}
            </div>
          ) : (
            <div className="hidden font-['Obvia'] text-lg dark:text-white md:block">
              reservoir.market
            </div>
          )}
          {CHAIN_ID === '4' && (
            <div className="reservoir-tiny inline rounded-[4px] bg-[#EFC45C] p-1 py-[2px] md:absolute md:left-[133px] md:top-7">
              Testnet
            </div>
          )}
        </a>
      </Link>
      <div className="flex w-full justify-center">
        {filterComponent && filterComponent}
        {hasExternalLinks && (
          <div className="ml-12 hidden items-center gap-11 lg:flex">
            {externalLinks.map(({ name, url }) => (
              <a
                key={url}
                href={url}
                rel="noopener noferrer"
                className="text-dark reservoir-h6 hover:text-[#1F2937] dark:text-white"
              >
                {name}
              </a>
            ))}
          </div>
        )}
      </div>
      <HamburgerMenu externalLinks={externalLinks} />
      <div className="ml-auto hidden shrink-0 md:block">
        <ConnectWallet />
      </div>
    </nav>
  )
}

export default Navbar
