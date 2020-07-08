import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import ShakaPlayer from "./ShakaPlayer"
import "shaka-player/dist/controls.css"
import {
  ENDED,
  initEmitter,
  PAUSE,
  SEEKED,
  TIMEUPDATE,
} from "../../../services/EventService"

import io from "socket.io-client"
const ENDPOINT = `${process.env.WSS_BASE_URL}/analytics`

const PlayerContainer = ({ video }) => {
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
    if (video) {
      const videoIdProps = JSON.parse(video).value
      setVideoId(videoIdProps)
      AP.context.getToken(async function (token) {
        try {
          const { data } = await getPlayUrl(videoIdProps, token)
          setPlayUrl(data.url)
          setLoading(false)
          const tokenData = await getDrmToken(videoIdProps, token)
          setVideoToken(tokenData.token)
          setTokenLoaded(true)
        } catch (e) {
          console.error("Some error happened getting the play url", e)
          setError("An error happened")
        }
      })
    }
  }, [video])

  useEffect(() => {
    if (!loading && tokenLoaded) {
      console.log("Im here", tokenLoaded, videoToken)
      AP.context.getToken(async (jwt) => {
        const videoElement = controllerRef.current.getVideoElement()

        videoElement.addEventListener("loadedmetadata", () =>
          setDuration(videoElement.duration)
        )

        let eventEmitter
        let socket
        videoElement.addEventListener(
          "play",
          async () => {
            await playCallback()
          },
          { once: true }
        )

        const playCallback = async () => {
          socket = io(`${ENDPOINT}`, {
            query: { token: `${jwt}` },
          })
          eventEmitter = initEmitter(socket)
          await socket.on("connect", () => {
            setIsSocketConnection(true)
            console.log(`Session for ${videoId} connected`)
            socket.emit("storeClientInfo", {
              videoId: videoId,
              duration: videoElement.duration,
            })
          })
        }

        videoElement.addEventListener("timeupdate", () =>
          eventEmitter.emit(TIMEUPDATE, videoElement.currentTime)
        )

        videoElement.addEventListener("pause", (event) =>
          eventEmitter.emit(
            PAUSE,
            event,
            videoElement.currentTime,
            videoElement.played
          )
        )

        videoElement.addEventListener("seeked", (event) =>
          eventEmitter.emit(
            SEEKED,
            event,
            videoElement.currentTime,
            videoElement.played
          )
        )
        videoElement.addEventListener("ended", (event) =>
          eventEmitter.emit(
            ENDED,
            event,
            videoElement.currentTime,
            videoElement.played
          )
        )

        return () => {
          videoElement.removeEventListener("loadedmetadata", () =>
            setDuration(videoElement.duration)
          )
          videoElement.removeEventListener(
            "play",
            async (event) => await playCallback()
          )
          videoElement.removeEventListener("pause", (event) =>
            eventEmitter.emit(
              PAUSE,
              event,
              videoElement.currentTime,
              videoElement.played
            )
          )

          videoElement.removeEventListener("seeked", (event) =>
            eventEmitter.emit(
              SEEKED,
              event,
              videoElement.currentTime,
              videoElement.played
            )
          )

          videoElement.removeEventListener("timeupdate", () =>
            eventEmitter.emit(TIMEUPDATE, videoElement.currentTime)
          )

          videoElement.removeEventListener("ended", (event) => {
            eventEmitter.emit(
              ENDED,
              event,
              videoElement.currentTime,
              videoElement.played
            )
            setIsSocketConnection(false)
          })
          socket.disconnect()
        }
      })
    }
  }, [loading])

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
  return axios.post(`video-player-play`, body, {
    headers,
  })
}

export default PlayerContainer
