import * as Accordion from '@radix-ui/react-accordion'
import { HiChevronDown } from 'react-icons/hi'
import { paths } from 'interfaces/apiTypes'
import { toggleOffItem, toggleOnAttributeKey } from 'lib/router'
import { useRouter } from 'next/router'
import { FC } from 'react'
import AttributeSelector from './filter/AttributeSelector'
import { SWRResponse } from 'swr'
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite'
import { FiChevronDown } from 'react-icons/fi'

type Props = {
  attributes: SWRResponse<
    paths['/attributes']['get']['responses']['200']['schema']
  >
  setTokensSize: SWRInfiniteResponse['setSize']
}

const Sidebar: FC<Props> = ({ attributes, setTokensSize }) => {
  const router = useRouter()

  return (
    <Accordion.Root
      type="multiple"
      className="my-3 hidden min-w-[200px] max-w-[250px] border-r-[1px] border-gray-300 md:block"
    >
      <div className="overflow-hidden">
        <button
          onClick={() => {
            router.query?.attribute_key === ''
              ? toggleOffItem(router, 'attribute_key')
              : toggleOnAttributeKey(router, 'attribute_key', '')
          }}
          className={`reservoir-label-l w-full border-b-[1px] border-gray-300 px-4 py-3 text-left transition ${
            router.query.attribute_key &&
            router.query.attribute_key.toString() === ''
              ? 'bg-primary-100 hover:bg-primary-300'
              : 'hover:bg-primary-100'
          }`}
        >
          Explore All
        </button>
      </div>
      {attributes.data?.attributes?.map((attribute) => (
        <Accordion.Item
          value={`item-${attribute.key}`}
          key={attribute.key}
          className="overflow-hidden"
        >
          <Accordion.Header
            className={`flex w-full justify-between border-b-[1px] border-gray-300 ${
              router.query.attribute_key &&
              router.query.attribute_key.toString() === attribute.key
                ? 'divide-gray-800 dark:divide-gray-300'
                : 'divide-gray-300 dark:divide-gray-800'
            }`}
          >
            <button
              onClick={() => {
                if (attribute.key) {
                  router.query?.attribute_key === attribute.key
                    ? toggleOffItem(router, 'attribute_key')
                    : toggleOnAttributeKey(
                        router,
                        'attribute_key',
                        attribute.key
                      )
                }
              }}
              className={`reservoir-label-l w-full px-4 py-3 text-left transition ${
                router.query.attribute_key &&
                router.query.attribute_key.toString() === attribute.key
                  ? 'bg-primary-100 hover:bg-primary-300'
                  : 'hover:bg-primary-100'
              }`}
            >
              {attribute.key}
            </button>
            <Accordion.Trigger
              className={`p-3 transition ${
                router.query.attribute_key &&
                router.query.attribute_key.toString() === attribute.key
                  ? 'bg-primary-100 hover:bg-primary-300'
                  : 'hover:bg-primary-100'
              }`}
            >
              <FiChevronDown className="h-5 w-5" aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <AttributeSelector
              attribute={attribute}
              setTokensSize={setTokensSize}
            />
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

export default Sidebar
