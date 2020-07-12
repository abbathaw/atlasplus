import React, { useEffect, useState } from "react"
import styled from "styled-components"
import NotificationAllIcon from "@atlaskit/icon/glyph/notification-all"
import LockIcon from "@atlaskit/icon/glyph/lock"
import PlayerContainer from "./PlayerContainer"

const PlayerOverlay = ({ video, thumbnailUrl, assignedUsers, currentUser }) => {
  const isCurrentUser =
    assignedUsers && Array.isArray(assignedUsers)
      ? assignedUsers.filter((users) => users.value === currentUser).length > 0
      : false

  const [showPlayer, setShowPlayer] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [imgUrl, setImgUrl] = useState("images/play.svg")
  const [jwtToken, setJwtToken] = useState("")
  const [isReady, setIsReady] = useState(false)

  const handleEndShow = () => {
    setImgUrl("images/replay.svg")
    setIsEnded(true)
    setShowPlayer(false)
  }

  const handleClickContainer = () => {
    AP.context.getToken(async function (token) {
      setJwtToken(token)
      setIsReady(true)
      if (video.drm) {
        const externalLink = `${process.env.BASE_URL}/external-player?title=${video.name}&videoId=${video.id}&isdrm=${video.drm}&issubtitle=${video.autoSubtitle}&jwt=${token}`
        window.open(externalLink)
      } else {
        setShowPlayer(true)
      }
    })
  }

  return (
    <>
      {showPlayer && isReady ? (
        <PlayerContainer
          videoIdProps={video.id}
          isAutoPlay={true}
          setEnded={handleEndShow}
          jwtToken={jwtToken}
          isDrm={video.drm}
          isSubtitle={video.autoSubtitle}
        />
      ) : (
        <Container onClick={handleClickContainer}>
          <Img src={thumbnailUrl} alt="thumbnail" />
          <Content>
            <Title> {video.name}</Title>
            <PlayLogo src={imgUrl} />
            <Footer>
              {isCurrentUser && (
                <Invited>
                  <NotificationAllIcon size="small" primaryColor="white" />
                  You've been invited to watch this video.
                </Invited>
              )}
              {video.drm && (
                <DRM>
                  <LockIcon size="small" primaryColor="white" /> This video is
                  DRM protected. It will open in a new tab
                </DRM>
              )}
            </Footer>
          </Content>
        </Container>
      )}
    </>
  )
}
export default PlayerOverlay

const DRM = styled.span`
  grid-column: 1 / span 1;
  grid-row: span 1 / -1;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif;
`

const Invited = styled.span`
  grid-column: 1 / span 1;
  grid-row: 1 / span 1;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif;
`

export const Container = styled.div`
  width: 100%;
  height: 400px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  background: black;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.4s;
`

export const Title = styled.h2`
  grid-row: 1 / span 1;
  align-self: center;
  justify-self: center;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif;
`
export const PlayLogo = styled.img`
  align-self: center;
  justify-self: center;
  grid-row: 2 / span 1;
  width: 80px;
  transition: transform 0.2s;
  ${Container}:hover & {
    transform: scale(1.5);
  }
`

export const Footer = styled.div`
  grid-row: span 1/ -1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 8px;
  margin: 10px 20px;
`

export const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
  grid-column: 1/-1;
  grid-row: 1/-1;
  opacity: 0.6;
`

const Content = styled.div`
  grid-column: 1/-1;
  grid-row: 1/-1;
  z-index: 10;
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 3fr 1fr;
`
