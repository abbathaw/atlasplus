import React, { useEffect, useState } from "react"
import Button from "@atlaskit/button"
import { useVideoAnalyticsModalContext } from "./Studio"
import Spinner from "@atlaskit/spinner"
import axios from "axios"

export const VideoAnalytics = ({ token, video }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [localData, setLocalData] = useState([]) // local view data for the video in the card

  useEffect(() => {
    getVideoViewData()
      .then((timeRangeData) => {
        setLocalData(timeRangeData)
        setIsLoading(false)
      })
      .catch((error) => console.log("failed to get view data", error))
  }, [])

  const getVideoViewData = async () => {
    const {
      data: { enrollments },
    } = await axios.get(`video-studio/videoAnalytics?videoId=${video.id}`, {
      headers: { Authorization: `JWT ${token}` },
    })

    console.log(
      "an array of arrays representing users watched TimeRanges -------------->",
      enrollments
    )
    return enrollments
  }

  const { openModal } = useVideoAnalyticsModalContext()

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <h3>
        <b>{localData.length}</b>
      </h3>
      <p>Unique plays</p>
      <p>
        <Button
          appearance={"default"}
          onClick={() => openModal(video, localData)}
        >
          View analytics
        </Button>
      </p>
    </>
  )
}
