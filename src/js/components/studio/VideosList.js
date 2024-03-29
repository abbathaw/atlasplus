import React, { useEffect, useState } from "react"
import { useTabSelectContext } from "./Studio"
import axios from "axios"
import Spinner from "@atlaskit/spinner"
import Button from "@atlaskit/button"
import styled from "styled-components"
import Page, { Grid, GridColumn } from "@atlaskit/page"
import { Thumbnail } from "./Thumbnail"
import { VideoAnalyticsActions } from "./VideoAnalyticsActions"

const VideosList = () => {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState("")

  useEffect(() => {
    //get Token to call backend
    AP.context.getToken(async (token) => {
      const { data: videos } = await axios.get(`video-studio/spaceVideos`, {
        headers: { Authorization: `JWT ${token}` },
      })

      setIsLoading(false)
      setToken(token)
      setVideos(videos)
    })
  }, [])

  const { setSelectedTab } = useTabSelectContext()

  return (
    <Page>
      {isLoading ? (
        <Spinner />
      ) : videos.length > 0 ? (
        videos.map((video, index) => (
          <Grid key={index}>
            <GridColumn medium={12}>
              <VideoCard>
                <Grid>
                  <GridColumn medium={3}>
                    <ThumbnailContainer>
                      <Thumbnail video={video} />
                    </ThumbnailContainer>
                  </GridColumn>
                  <GridColumn medium={5}>
                    <CardContainer>
                      <h3>
                        <b>{video.name}</b>
                      </h3>
                      <p>
                        <small>
                          Duration:{" "}
                          {new Date(parseInt(video.durationInMs))
                            .toISOString()
                            .substr(11, 8)}{" "}
                          | Status: {video.status} | Upload date:{" "}
                          {new Date(video.updatedAt).toDateString()}
                        </small>
                      </p>
                    </CardContainer>
                  </GridColumn>
                  <VideoAnalyticsActions video={video} token={token} />
                </Grid>
              </VideoCard>
            </GridColumn>
          </Grid>
        ))
      ) : (
        <Grid>
          <GridColumn medium={12}>
            <div style={{ margin: "50px 0px" }}>
              <b>No videos have been uploaded yet!</b>
            </div>
            <Button
              appearance={"primary"}
              onClick={() => setSelectedTab({ tab: 0 })}
            >
              Upload a video
            </Button>
          </GridColumn>
        </Grid>
      )}
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
  padding: 20px 5px 0px 5px;
  margin: 5px;
  height: 100px;
`
const ThumbnailContainer = styled.div`
  padding: 5px;
  margin: 5px;
  text-align: center;
  height: 100px;
`

export default VideosList
