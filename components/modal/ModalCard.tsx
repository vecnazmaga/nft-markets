import React, { FC, ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { HiX } from 'react-icons/hi'
import { optimizeImage } from 'lib/optmizeImage'
import Steps from 'components/Steps'
import { Execute } from 'lib/executeSteps'
import FormatEth from 'components/FormatEth'

type Props = {
  data: {
    token?: {
      image?: string | undefined
      name?: string | undefined
      id?: string | undefined
      contract?: string | undefined
      topBuyValue?: number | undefined
      floorSellValue?: number | undefined
    }
    collection?: {
      id?: string | undefined
      image?: string | undefined
      name?: string | undefined
      tokenCount?: number
    }
    attribute?: {
      key?: string | undefined
      value?: string | undefined
    }
  }
  onCloseCallback?: () => any
  orderbook: 'reservoir' | 'opensea'
  actionButton?: ReactNode
  steps: Execute['steps']
  title: string
}

const ModalCard: FC<Props> = ({
  actionButton,
  children,
  data,
  orderbook,
  onCloseCallback,
  steps,
  title,
}) => {
  // SUBTITLE
  // Attribute Offer -> Loot (for Adventurers)
  // Collection Offer -> Collection
  // Token Offer -> Loot (for Adventurers)
  const subTitle =
    data?.attribute || data?.token ? data?.collection?.name : 'Collection'

  // If all executed succesfully, then success is true
  const success = steps && !steps.find(({ status }) => status === 'incomplete')

  return (
    <Dialog.Content className="fixed inset-0 bg-[#000000b6]">
      <div className="fixed top-1/2 left-1/2 w-[460px] -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-white p-11 shadow-md ">
        <div className="mb-4 flex items-center justify-between">
          <Dialog.Title className="reservoir-h4">{title}</Dialog.Title>
          <Dialog.Close
            onClick={onCloseCallback}
            className="btn-primary-outline p-1.5"
          >
            <HiX className="h-5 w-5" />
          </Dialog.Close>
        </div>
        <div className="mb-5 flex items-center gap-4">
          <img
            src={optimizeImage(
              data?.collection?.image || data?.token?.image,
              50
            )}
            className="w-[50px]"
          />
          <div className="overflow-auto">
            <div className="reservoir-body">{subTitle}</div>
            <div className="reservoir-h4 my-1.5">
              {/* If this is an offer modal, change */}
              {/* the header based on the type of offer */}
              {data?.attribute ? (
                <>
                  <span>{data?.attribute?.key}: </span>
                  <span>{data?.attribute?.value}</span>
                </>
              ) : data?.token ? (
                data?.token?.name
              ) : (
                data?.collection?.name
              )}
            </div>
            {data?.collection?.tokenCount && (
              <div className="reservoir-body mb-1.5">
                {`${data?.collection?.tokenCount} Eligible Tokens`}
              </div>
            )}
          </div>
        </div>
        <div className="reservoir-body mb-5 flex flex-wrap items-stretch gap-1.5">
          <TopOffer topBuyValue={data?.token?.topBuyValue} />
          <ListPrice floorSellValue={data?.token?.floorSellValue} />
        </div>
        {steps ? (
          <div>
            {orderbook === 'opensea' && (
              <div className="reservoir-h6 mb-6 flex items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1 h-8 w-8 fill-[#2081e2]"
                  viewBox="0 0 100 100"
                >
                  <path d="M50 0C22.39 0 0 22.39 0 50C0 77.61 22.39 100 50 100C77.61 100 100 77.61 100 50C100 22.39 77.62 0 50 0ZM24.67 51.68L24.88 51.34L37.89 30.99C38.08 30.7 38.53 30.73 38.67 31.05C40.84 35.92 42.72 41.98 41.84 45.75C41.47 47.3 40.44 49.4 39.28 51.34C39.13 51.62 38.97 51.9 38.79 52.17C38.71 52.29 38.57 52.36 38.42 52.36H25.05C24.69 52.36 24.48 51.97 24.67 51.68ZM82.64 58.68C82.64 58.87 82.53 59.03 82.37 59.1C81.36 59.53 77.91 61.12 76.48 63.11C72.82 68.2 70.03 75.48 63.78 75.48H37.72C28.48 75.48 21 67.97 21 58.7V58.4C21 58.16 21.2 57.96 21.45 57.96H35.97C36.26 57.96 36.47 58.22 36.45 58.51C36.34 59.45 36.52 60.42 36.97 61.3C37.83 63.05 39.62 64.14 41.55 64.14H48.74V58.53H41.63C41.27 58.53 41.05 58.11 41.26 57.81C41.34 57.69 41.42 57.57 41.52 57.43C42.19 56.47 43.15 54.99 44.11 53.3C44.76 52.16 45.39 50.94 45.9 49.72C46 49.5 46.08 49.27 46.17 49.05C46.31 48.66 46.45 48.29 46.55 47.93C46.65 47.62 46.74 47.3 46.82 47C47.06 45.96 47.16 44.86 47.16 43.72C47.16 43.27 47.14 42.8 47.1 42.36C47.08 41.87 47.02 41.38 46.96 40.89C46.92 40.46 46.84 40.03 46.76 39.59C46.65 38.94 46.51 38.29 46.35 37.64L46.29 37.39C46.17 36.94 46.06 36.52 45.92 36.07C45.51 34.67 45.05 33.3 44.55 32.02C44.37 31.51 44.17 31.02 43.96 30.54C43.66 29.8 43.35 29.13 43.07 28.5C42.92 28.21 42.8 27.95 42.68 27.68C42.54 27.38 42.4 27.08 42.25 26.79C42.15 26.57 42.03 26.36 41.95 26.16L41.07 24.54C40.95 24.32 41.15 24.05 41.39 24.12L46.89 25.61H46.91C46.92 25.61 46.92 25.61 46.93 25.61L47.65 25.82L48.45 26.04L48.74 26.12V22.86C48.74 21.28 50 20 51.57 20C52.35 20 53.06 20.32 53.56 20.84C54.07 21.36 54.39 22.07 54.39 22.86V27.71L54.98 27.87C55.02 27.89 55.07 27.91 55.11 27.94C55.25 28.04 55.46 28.2 55.72 28.4C55.93 28.56 56.15 28.76 56.41 28.97C56.94 29.4 57.58 29.95 58.27 30.58C58.45 30.74 58.63 30.9 58.8 31.07C59.69 31.9 60.69 32.87 61.65 33.95C61.92 34.26 62.18 34.56 62.45 34.89C62.71 35.22 63 35.54 63.24 35.86C63.57 36.29 63.91 36.74 64.22 37.21C64.36 37.43 64.53 37.66 64.66 37.88C65.06 38.47 65.4 39.08 65.73 39.69C65.87 39.97 66.01 40.28 66.13 40.58C66.5 41.4 66.79 42.23 66.97 43.07C67.03 43.25 67.07 43.44 67.09 43.62V43.66C67.15 43.9 67.17 44.16 67.19 44.43C67.27 45.28 67.23 46.14 67.05 47C66.97 47.36 66.87 47.7 66.75 48.07C66.62 48.42 66.5 48.78 66.34 49.13C66.03 49.84 65.67 50.56 65.24 51.22C65.1 51.47 64.93 51.73 64.77 51.98C64.59 52.24 64.4 52.49 64.24 52.73C64.01 53.04 63.77 53.36 63.52 53.65C63.3 53.95 63.08 54.25 62.83 54.52C62.49 54.93 62.16 55.31 61.81 55.68C61.61 55.92 61.39 56.17 61.16 56.39C60.94 56.64 60.71 56.86 60.51 57.06C60.16 57.41 59.88 57.67 59.64 57.9L59.07 58.41C58.99 58.49 58.88 58.53 58.77 58.53H54.39V64.14H59.9C61.13 64.14 62.3 63.71 63.25 62.9C63.57 62.62 64.98 61.4 66.65 59.56C66.71 59.49 66.78 59.45 66.86 59.43L82.07 55.03C82.36 54.95 82.64 55.16 82.64 55.46V58.68V58.68Z" />
                </svg>
                Cross Post to OpenSea
              </div>
            )}
            <Steps steps={steps} />
          </div>
        ) : (
          children
        )}
        {success ? (
          <Dialog.Close
            onClick={onCloseCallback}
            className="btn-primary-outline w-full"
          >
            Success, Close this menu
          </Dialog.Close>
        ) : (
          <div className="flex items-center gap-4">
            <Dialog.Close
              onClick={onCloseCallback}
              className="btn-primary-outline w-full"
            >
              Cancel
            </Dialog.Close>
            {actionButton}
          </div>
        )}
      </div>
    </Dialog.Content>
  )
}

export default ModalCard

export const ListPrice = ({
  floorSellValue,
}: {
  floorSellValue: number | undefined
}) => {
  if (floorSellValue) {
    return (
      <div className="reservoir-label-m flex items-center gap-2 rounded-[8px] bg-[#E2CCFF] px-2 py-0.5 text-[#111827]">
        <span className="whitespace-nowrap">List Price</span>
        <div>
          <FormatEth
            amount={floorSellValue}
            maximumFractionDigits={4}
            logoWidth={7}
          />
        </div>
      </div>
    )
  }

  return null
}

export const TopOffer = ({
  topBuyValue,
}: {
  topBuyValue: number | undefined
}) => {
  if (topBuyValue) {
    return (
      <div className="reservoir-label-m flex items-center gap-2 rounded-[8px] bg-[#E2CCFF] px-2 py-0.5">
        <span className="whitespace-nowrap">Current Top Offer</span>
        <div>
          <FormatEth
            amount={topBuyValue}
            maximumFractionDigits={4}
            logoWidth={7}
          />
        </div>
      </div>
    )
  }

  return null
}
