import { Signer } from 'ethers'
import { paths } from 'interfaces/apiTypes'
import executeSteps, { Execute } from 'lib/executeSteps'
import setParams from 'lib/params'

type Data = {
  tokenId: string | undefined
  contract: string | undefined
  signer: Signer | undefined
  apiBase: string | undefined
  setSteps: React.Dispatch<React.SetStateAction<Execute['steps']>>
  handleUserRejection?: () => any
  handleError?: (err: any) => any
  handleSuccess?: () => any
}

export default async function buyToken(data: Data) {
  const {
    tokenId,
    contract,
    signer,
    apiBase,
    setSteps,
    handleUserRejection,
    handleSuccess,
    handleError,
  } = data

  if (!tokenId || !contract || !signer || !apiBase) {
    console.debug(data)
    throw new ReferenceError('Some data is missing')
  }

  try {
    const url = new URL('/execute/buy', apiBase)

    const query: paths['/execute/buy']['get']['parameters']['query'] = {
      contract,
      tokenId,
      taker: await signer.getAddress(),
    }

    setParams(url, query)

    await executeSteps(url, signer, setSteps)

    if (handleSuccess) handleSuccess()
  } catch (err: any) {
    // Handle user rejection
    if (err?.code === 4001) {
      // close modal
      if (handleUserRejection) handleUserRejection()
    }
    if (handleError) handleError(err)
    console.error(err)
  }
}
