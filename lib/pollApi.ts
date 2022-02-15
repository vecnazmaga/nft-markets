import { KeyedMutator } from 'swr'
import { URL } from 'url'

async function pollSwr(previousJson: any, mutate: KeyedMutator<any>) {
  const json = await mutate()

  // Check that the response from an endpoint updated
  if (JSON.stringify(previousJson) !== JSON.stringify(json)) {
    return true
  } else {
    // The response is still unchanged. Check again in five seconds
    await new Promise((resolve) => setTimeout(resolve, 5000))
    await pollSwr(json, mutate)
  }
}

async function pollUntilHasData(url: URL, index: number) {
  const res = await fetch(url.href)

  const json = await res.json()

  // Check if the data exists
  if (json?.steps?.[index]?.data) return json

  // The response is still unchanged. Check again in five seconds
  await new Promise((resolve) => setTimeout(resolve, 5000))
  await pollUntilHasData(url, index)
}

async function pollUntilOk(url: URL) {
  const res = await fetch(url.href)

  // Check that the response from an endpoint updated
  if (res.ok) {
    return
  } else {
    // The response is still unchanged. Check again in five seconds
    await new Promise((resolve) => setTimeout(resolve, 5000))
    await pollUntilOk(url)
  }
}

export { pollSwr, pollUntilHasData, pollUntilOk }
