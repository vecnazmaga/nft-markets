import Link from 'next/link'
import formatUrl from 'lib/formatUrl'
import { paths } from '@reservoir0x/client-sdk'

type Props = {
  token: NonNullable<
    paths['/tokens/details/v4']['get']['responses']['200']['schema']['tokens']
  >[0]['token']
}

const TokenAttributes = ({ token }: Props) => {
  return (
    <div className="col-span-full md:col-span-4 lg:col-span-5 lg:col-start-2">
      <article className="col-span-full rounded-2xl border-[1px] border-gray-300 bg-white p-6">
        <p className="reservoir-h5 mb-4">Attributes</p>
        <div className=" grid max-h-[440px] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
          {token?.attributes?.map(({ key, value }) => (
            <Link
              key={`${key}-${value}`}
              href={`/collections/${token?.collection?.id}?${formatUrl(
                `attributes[${key}]`
              )}=${formatUrl(`${value}`)}`}
            >
              <a className="rounded-lg border border-gray-300 transition  hover:shadow-md">
                <p className="reservoir-subtitle truncate p-3 text-center capitalize">
                  {key}
                </p>
                <p
                  className="reservoir-subtitle truncate bg-primary-100 p-3 text-center capitalize"
                  title={value}
                >
                  {value}
                </p>
              </a>
            </Link>
          ))}
        </div>
      </article>
    </div>
  )
}

export default TokenAttributes
