import styled from "styled-components"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Spinner from "@atlaskit/spinner"
import MediaServicesNoImageIcon from "@atlaskit/icon/glyph/media-services/no-image"

export const Thumbnail = ({ videoId, token }) => {
  const [thumbnail, setThumbnail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getVideoThumbnails().then((thumbnailUrl) => {
      thumbnailUrl && setThumbnail(thumbnailUrl)
      setIsLoading(false)
    })
  }, [])

  const getVideoThumbnails = async () => {
    const {
      data: { thumbnailUrl },
    } = await axios.get(`video-studio/videoThumbnails?videoId=${videoId}`, {
      headers: { Authorization: `JWT ${token}` },
    })
    console.log("url-------------->", thumbnailUrl)
    return thumbnailUrl
  }

  return isLoading ? (
    <Spinner />
  ) : thumbnail ? (
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

const ThumbnailImg = styled.img`
  padding: 2px 8px;
  border-radius: 5px 5px 0 0;
  width: 100%;
  max-width: 300px;
  margin: 10px 2px 0 2px;
`