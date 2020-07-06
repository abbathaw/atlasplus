import React, { useEffect, useState } from "react"
import { useTabSelectContext } from "./Studio"
import axios from "axios"
import Spinner from "@atlaskit/spinner"
import Button from "@atlaskit/button"
import styled from "styled-components"
import Page, { Grid, GridColumn } from "@atlaskit/page"

const VideosList = () => {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    //get Token to call backend
    AP.context.getToken(async (token) => {
      const { data: videos } = await axios.get(`video-studio/spaceVideos`, {
        headers: { Authorization: `JWT ${token}` },
      })
      console.log("videos-------------->", videos)
      const videosWithThumbnails = Promise.all(
        videos.map(async (video) => {
          return {
            ...video,
            thumbnailUrl: await getVideoThumbnails(video.id),
          }
        })
      )

      console.log(
        "videos with thumbnails-------------->",
        await videosWithThumbnails
      )
      setIsLoading(false)
      setVideos(await videosWithThumbnails)
    })
  }, [])

  const getVideoThumbnails = (videoId) => {
    return new Promise((resolve) => {
      AP.context.getToken(async (token) => {
        const {
          data: { thumbnailUrl },
        } = await axios.get(`video-studio/videoThumbnails?videoId=${videoId}`, {
          headers: { Authorization: `JWT ${token}` },
        })
        console.log("url-------------->", thumbnailUrl)
        resolve(thumbnailUrl)
      })
    })
  }
  const { setSelectedTab } = useTabSelectContext()

  return (
    <Page>
      <Grid>
        <GridColumn medium={12}>
          {isLoading ? (
            <Spinner />
          ) : videos.length > 0 ? (
            videos.map((video, index) => (
              <Grid key={index}>
                <GridColumn medium={12}>
                  <VideoCard>
                    <Grid>
                      <GridColumn medium={3}>
                        <Thumbnail
                          src={video.thumbnailUrl}
                          alt={"thumbnail"}
                          style={{ width: "100%" }}
                        />
                      </GridColumn>
                      <GridColumn medium={9}>
                        <CardContainer>
                          <h4>
                            <b>{video.name}</b>
                          </h4>
                          <p>
                            <b>Size:</b> {parseFloat(video.sizeInMb).toFixed(2)}{" "}
                            MB
                          </p>
                          <p>
                            <b>Status:</b> {video.status}
                          </p>
                          <p>
                            <b>Upload date:</b>{" "}
                            {new Date(video.updatedAt).toDateString()}
                          </p>
                        </CardContainer>
                      </GridColumn>
                    </Grid>
                  </VideoCard>
                </GridColumn>
              </Grid>
            ))
          ) : (
            <>
              <div style={{ margin: "50px 0px" }}>
                <b>No videos have been uploaded yet!</b>
              </div>
              <Button
                appearance={"primary"}
                onClick={() => setSelectedTab({ tab: 0 })}
              >
                Upload a video
              </Button>
            </>
          )}
        </GridColumn>
      </Grid>
    </Page>
  )
}

const VideoCard = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;
  margin: 10px;

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
`

const CardContainer = styled.div`
  padding: 2px 8px;
  margin: 10px;
`

const Thumbnail = styled.img`
  padding: 2px 8px;
  border-radius: 5px 5px 0 0;
  max-width: 300px;
  margin: 10px 2px 0 2px;
`

export default VideosList
