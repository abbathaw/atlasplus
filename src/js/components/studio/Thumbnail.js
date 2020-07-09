import styled from "styled-components"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Spinner from "@atlaskit/spinner"
import MediaServicesNoImageIcon from "@atlaskit/icon/glyph/media-services/no-image"

export const Thumbnail = ({ video }) => {
  const [thumbnail, setThumbnail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (video && !objIsEmpty(video)) {
      let num = 1
      const thumbnailUrl = `https://${process.env.S3_BUCKET_NAME}.s3-us-west-2.amazonaws.com/output/${video.tenantId}/${video.id}/thumbnails/${video.fileId}thumbnail.000000${num}.jpg`
      setThumbnail(thumbnailUrl)
      setIsLoading(false)
    }
  }, [video])

  return isLoading ? (
    <Spinner />
  ) : video.status === "ready" ? (
    <ThumbnailImg src={thumbnail} alt={"thumbnail"} />
  ) : (
    <>
      <MediaServicesNoImageIcon size={"xlarge"} label={"Thumbnail not ready"} />
      <p>
        <small>Video is still being processed</small>
      </p>
    </>
  )
}

const objIsEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

const ThumbnailImg = styled.img`
  border-radius: 5px 5px 0 0;
  height: 100%;
  max-width: 300px;
  max-height: 100px;
`
