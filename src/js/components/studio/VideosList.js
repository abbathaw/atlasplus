import React, { useEffect, useState } from "react"
import { useTabSelectContext } from "./Studio"
import axios from "axios"
import Spinner from "@atlaskit/spinner"
import Button from "@atlaskit/button"
import styled from "styled-components"
import Page, { Grid, GridColumn } from "@atlaskit/page"
import { Thumbnail } from "./Thumbnail"
import { AnalyticsModal } from "./AnalyticsModal"

const VideosList = () => {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState("")
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)

  const openDrawer = () => {
    setIsAnalyticsModalOpen(true)
    // AP.resize(1800, 1800)
  }
  const closeModal = () => setIsAnalyticsModalOpen(false)

  useEffect(() => {
    //get Token to call backend
    AP.context.getToken(async (token) => {
      const { data: videos } = await axios.get(`video-studio/spaceVideos`, {
        headers: { Authorization: `JWT ${token}` },
      })
      console.log("videos-------------->", videos)

      setIsLoading(false)
      setToken(token)
      setVideos(videos)
    })
  }, [])

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
                  <VideoCard
                  // style={
                  //   isAnalyticsModalOpen
                  //     ? {
                  //         "min-height": "90vh",
                  //       }
                  //     : {}
                  // }
                  >
                    <Grid>
                      <GridColumn medium={3}>
                        <Thumbnail videoId={video.id} token={token} />
                      </GridColumn>
                      <GridColumn medium={6}>
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
                      <GridColumn medium={3}>
                        <CardContainer>
                          <h4>
                            <em>View count</em>
                          </h4>
                          <p>55 views</p>
                          <p>
                            <Button
                              spacing={"none"}
                              appearance={"link"}
                              onClick={openDrawer}
                            >
                              Show more analytics
                            </Button>
                          </p>
                          {isAnalyticsModalOpen && (
                            <AnalyticsModal
                              video={video}
                              closeModal={closeModal}
                            />
                          )}
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

export default VideosList
