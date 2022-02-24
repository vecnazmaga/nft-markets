import { Signer } from 'ethers'
import { paths } from 'interfaces/apiTypes'
import { Execute } from 'lib/executeSteps'
import React, { ComponentProps, FC, useState } from 'react'
import { SWRResponse } from 'swr'
import * as Dialog from '@radix-ui/react-dialog'
import ModalCard from './modal/ModalCard'
import cancelOrder from 'lib/actions/cancelOrder'
import { useConnect } from 'wagmi'
import Toast from './Toast'

type Props = {
  isInTheWrongNetwork: boolean | undefined
  details: SWRResponse<
    paths['/tokens/details']['get']['responses']['200']['schema'],
    any
  >
  data: ComponentProps<typeof ModalCard>['data']
  apiBase: string
  signer: Signer | undefined
  show: boolean
  setToast: (data: ComponentProps<typeof Toast>['data']) => any
}

const CancelListing: FC<Props> = ({
  isInTheWrongNetwork,
  details,
  data,
  apiBase,
  signer,
  show,
  setToast,
}) => {
  const [waitingTx, setWaitingTx] = useState<boolean>(false)
  const [{ data: connectData }, connect] = useConnect()
  const [steps, setSteps] = useState<Execute['steps']>()
  const [open, setOpen] = useState(false)

  const token = details.data?.tokens?.[0]

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {show && (
        <Dialog.Trigger
          disabled={waitingTx || isInTheWrongNetwork}
          onClick={async () => {
            if (!signer) {
              const data = await connect(connectData.connectors[0])
              if (data?.data) {
                setToast({
                  kind: 'success',
                  message: 'Connected your wallet successfully.',
                  title: 'Wallet connected',
                })
              }
              return
            }

            setWaitingTx(true)
            await cancelOrder({
              hash: token?.market?.floorSell?.hash,
              maker: token?.market?.floorSell?.maker,
              signer,
              apiBase,
              setSteps,
              handleSuccess: () => details.mutate(),
              handleError: (err: any) => {
                // Handle user rejection
                if (err?.code === 4001) {
                  setOpen(false)
                  setSteps(undefined)
                  setToast({
                    kind: 'error',
                    message: 'You have canceled the transaction.',
                    title: 'User canceled transaction',
                  })
                  return
                }
                setToast({
                  kind: 'error',
                  message: 'The transaction was not completed.',
                  title: 'Could not cancel listing',
                })
              },
            })
            setWaitingTx(false)
          }}
          className="btn-red-ghost col-span-2 mx-auto mt-6"
        >
          {waitingTx ? 'Waiting...' : 'Cancel listing'}
        </Dialog.Trigger>
      )}
      {steps && (
        <Dialog.Portal>
          <Dialog.Overlay>
            <ModalCard title="Cancel your listing" data={data} steps={steps} />
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  )
}

export default CancelListing
