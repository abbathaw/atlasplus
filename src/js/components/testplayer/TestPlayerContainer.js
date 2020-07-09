import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import ShakaPlayer from "../macro/components/ShakaPlayer"
import "shaka-player/dist/controls.css"

const TestPlayerContainer = ({ video }) => {
  const [playUrl, setPlayUrl] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = React.useState(true)
  const [tokenLoaded, setTokenLoaded] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const [videoId, setVideoId] = React.useState("")
  const [isSocketConnection, setIsSocketConnection] = React.useState(false)
  const [videoToken, setVideoToken] = useState("")
  const controllerRef = useRef()

  useEffect(() => {
    if (video && video.id) {
      // AP.context.getToken(async function (token) {
      ;(async function getStuff(token) {
        try {
          const videoIdProps = video.id
          console.log("videoId", videoIdProps)
          setVideoId(videoIdProps)
          const { data } = await getPlayUrl(videoIdProps, token)
          setPlayUrl(data.url)
          setLoading(false)
          const tokenData = await getDrmToken(videoIdProps, token)
          setVideoToken(tokenData.data.token)
          setTokenLoaded(true)
          console.log("got the stuff I want", tokenData.data.token)
        } catch (e) {
          console.error("Some error happened getting the play url", e)
          setError("An error happened")
        }
      })()
      // })
    }
  }, [video])

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <div style={{ height: "700px", width: "100%" }}>
          {" "}
          {!loading && tokenLoaded && (
            <ShakaPlayer
              autoplay={false}
              src={playUrl}
              ref={controllerRef}
              drmToken={videoToken}
            />
          )}
        </div>
      )}
    </div>
  )
}

function getDrmToken(videoId, token) {
  const body = {
    videoId: videoId,
  }
  const headers = { Authorization: `JWT ${token}` }
  return axios.post(`playToken`, body, {
    headers,
  })
}

function getPlayUrl(videoId, token) {
  const body = {
    videoId: videoId,
  }
  const headers = { Authorization: `JWT ${token}` }
  return axios.post(`video-player-play-test`, body, {
    headers,
  })
}

export default TestPlayerContainer
