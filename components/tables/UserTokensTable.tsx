import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import { formatBN, formatNumber } from 'lib/numbers'
import { FC } from 'react'
import useUserTokens from 'hooks/useUserTokens'
import FormatEth from 'components/FormatEth'

type Props = {
  data: ReturnType<typeof useUserTokens>
}

const UserTokensTable: FC<Props> = ({ data: { ref, tokens } }) => {
  const { data } = tokens
  const tokensFlat = data ? data.flatMap(({ tokens }) => tokens) : []
  const isOwner = true

  return (
    <div className="mb-11 overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
      <table className="min-w-full table-auto divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Item', 'List Price', 'Top Offer', 'Floor'].map((item) => (
              <th
                key={item}
                scope="col"
                className="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokensFlat?.map((token, index, arr) => (
            <tr
              key={`${token?.token?.collection?.id}-${index}`}
              ref={index === arr.length - 5 ? ref : null}
              className="group bg-white even:bg-gray-50"
            >
              <td className="whitespace-nowrap px-6 py-4 capitalize text-gray-500">
                <Link
                  href={`/${token?.token?.contract}/${token?.token?.tokenId}`}
                >
                  <a className="flex items-center gap-2">
                    <div className="relative h-10 w-10">
                      {token?.token?.image && (
                        <div className="aspect-w-1 aspect-h-1 relative">
                          <img
                            src={optimizeImage(token?.token?.image, 35)}
                            alt={token?.token?.image}
                            className="w-[35px] object-contain"
                            width="35"
                            height="35"
                          />
                        </div>
                      )}
                    </div>
                    <span className="whitespace-nowrap">
                      <div> {token?.token?.collection?.name}</div>
                      <div className="font-semibold">{token?.token?.name}</div>
                    </span>
                  </a>
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 capitalize text-gray-500">
                <div className="min-w-[70px]">
                  <span className={`${isOwner ? 'group-hover:hidden' : ''}`}>
                    <FormatEth
                      amount={token?.ownership?.floorSellValue}
                      maximumFractionDigits={4}
                    />
                  </span>
                  {isOwner && (
                    <div className="hidden group-hover:inline-block">
                      <Link
                        href={`/${token?.token?.contract}/${token?.token?.tokenId}`}
                      >
                        <a className="btn-blue-ghost">
                          {token?.ownership?.floorSellValue ? 'Edit' : 'List'}
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 capitalize text-gray-500">
                {token?.token?.topBuy?.value ? (
                  isOwner ? (
                    <div className="min-w-[95px]">
                      <span className="group-hover:hidden">
                        <FormatEth
                          amount={token?.token?.topBuy?.value}
                          maximumFractionDigits={4}
                        />
                      </span>
                      <div className="btn-green-ghost hidden group-hover:inline-block">
                        Accept
                      </div>
                    </div>
                  ) : (
                    <FormatEth
                      amount={token?.token?.topBuy?.value}
                      maximumFractionDigits={4}
                    />
                  )
                ) : (
                  '-'
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 capitalize text-gray-500">
                <FormatEth
                  amount={token?.ownership?.floorSellValue}
                  maximumFractionDigits={4}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTokensTable
