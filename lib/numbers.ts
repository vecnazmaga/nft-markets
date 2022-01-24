import { utils } from 'ethers'
import { BigNumberish } from '@ethersproject/bignumber'

const { format: formatDollar } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

function formatNumber(amount: number | null | undefined) {
  const { format } = new Intl.NumberFormat('en-US')
  if (!amount) {
    return '-'
  }
  return format(amount)
}

/**
 *  Convert ETH values to human readable formats
 * @param amount An ETH amount
 * @param maximumFractionDigits Number of decimal digits
 * @returns returns the ETH value as a `string` or `-` if the amount is `null` or `undefined`
 */
function formatBN(
  amount: BigNumberish | null | undefined,
  maximumFractionDigits: number
) {
  if (!amount) return '-'

  let value = ''

  if (typeof amount === 'number') {
    value = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits,
    }).format(amount)
  } else {
    value = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits,
    }).format(+utils.formatEther(amount))
  }

  return value
}

export { formatDollar, formatBN, formatNumber }
