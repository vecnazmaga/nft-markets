import { paths } from 'interfaces/apiTypes'
import { optimizeImage } from 'lib/optmizeImage'
import React, { FC } from 'react'

type Props = {
  sample_images: NonNullable<
    paths['/collections/{collection}/attributes']['get']['responses']['200']['schema']['attributes']
  >[0]['sampleImages']
  value: NonNullable<
    paths['/collections/{collection}/attributes']['get']['responses']['200']['schema']['attributes']
  >[0]['value']
}

const ImagesGrid: FC<Props> = ({ sample_images, value }) => {
  return (
    <>
      {!!sample_images && sample_images.length > 0 ? (
        <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-1.5">
          {sample_images.length > 1 ? (
            // SMALLER IMAGE, HAS SIDE IMAGES
            <img
              alt={`${value}`}
              src={optimizeImage(sample_images[0], 250)}
              className="col-span-2 h-full rounded object-cover"
              width="224"
              height="224"
            />
          ) : (
            // BIG IMAGE, NO SIDE IMAGES
            <img
              alt={`${value}`}
              src={optimizeImage(sample_images[0], 300)}
              className="col-span-2 rounded object-contain"
              width="300"
              height="300"
            />
          )}
          {sample_images.length > 1 && (
            <div className="flex h-full flex-col justify-between gap-1">
              {sample_images.slice(1).map((image) => (
                <img
                  key={image}
                  src={optimizeImage(image, 70)}
                  alt={`${value}`}
                  width="70"
                  height="70"
                  className="w-[70px] rounded"
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-w-1 aspect-h-1 relative">
          <img
            src="https://via.placeholder.com/250"
            alt={`${value}`}
            width="250"
            height="250"
          />
        </div>
      )}
    </>
  )
}

export default ImagesGrid
