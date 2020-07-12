import React, { useEffect, useState } from "react"
import Button from "@atlaskit/button"
import { useVideoAnalyticsModalContext } from "./Studio"
import Spinner from "@atlaskit/spinner"
import axios from "axios"
import styled from "styled-components"
import { GridColumn } from "@atlaskit/page"

export const VideoAnalyticsActions = ({ token, video }) => {
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

    return enrollments
  }

  const { openModal, loadWatchersTable } = useVideoAnalyticsModalContext()

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <GridColumn medium={2}>
        <CardContainer>
          <h3>
            <b>{localData.length}</b>
          </h3>
          <p>Unique plays</p>
        </CardContainer>
      </GridColumn>
      <GridColumn medium={2}>
        <CardContainer>
          <p>
            <Button
              appearance={"primary"}
              onClick={() => openModal(video, localData)}
              shouldFitContainer={true}
            >
              Analytics
            </Button>
          </p>
          <p>
            <Button
              appearance={"default"}
              onClick={() => loadWatchersTable(video, localData)}
              shouldFitContainer={true}
            >
              Viewers
            </Button>
          </p>
        </CardContainer>
      </GridColumn>
    </>
  )
}

const CardContainer = styled.div`
  padding: 20px 5px 0px 5px;
  margin: 5px;
  text-align: center;
  height: 100px;
`
