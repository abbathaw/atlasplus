import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import ShakaPlayer from "./ShakaPlayer"
import "shaka-player/dist/controls.css"
import {
  CANPLAY,
  ENDED,
  initEmitter,
  PAUSE,
  PLAY,
  SEEKED,
  SEEKING,
} from "../../../services/EventService"

import io from "socket.io-client"
const ENDPOINT = `${process.env.WSS_BASE_URL}/analytics`

const PlayerContainer = ({ video }) => {
  const [playUrl, setPlayUrl] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = React.useState(true)
  const controllerRef = useRef()

  useEffect(() => {
    if (video) {
      AP.context.getToken(async function (token) {
        try {
          const { data } = await getPlayUrl(video, token)
          setPlayUrl(data.url)
          setLoading(false)
        } catch (e) {
          console.error("Some error happened getting the play url", e)
          setError("An error happened")
        }
      })
    }
  }, [video])

  useEffect(() => {
    if (!loading) {
      AP.context.getToken(async (jwt) => {
        const socket = io(`${ENDPOINT}`, {
          query: { token: `${jwt}` },
        })
        socket.on("connect", () => {
          socket.emit("storeClientInfo", {
            customId: "dadasdas FROM CONFLUENCE",
          })
          // either with send()
          socket.send("Hello!")

          // or with emit() and custom event names
          socket.emit(
            "salutations",
            "Hello!",
            { mr: " Ali" },
            Uint8Array.from([1, 2, 3, 4])
          )
          // handle the event sent with socket.send()
          socket.on("message", (data) => {
            console.log(data)
          })

          // handle the event sent with socket.emit()
          socket.on("greetings", (elem1, elem2, elem3) => {
            console.log(elem1, elem2, elem3)
          })
        })
        const videoElement = controllerRef.current.getVideoElement()
        console.log("what is video element", videoElement)
        console.log("DURATIOn", videoElement.duration)
        const eventEmitter = initEmitter()
        videoElement.addEventListener("loadedmetadata", (event) =>
          console.log("duration", videoElement.duration)
        )
        videoElement.addEventListener("canplay", (event) =>
          eventEmitter.emit(CANPLAY, event, videoElement.currentTime)
        )
        videoElement.addEventListener("play", (event) =>
          eventEmitter.emit(PLAY, event, videoElement.currentTime)
        )
        videoElement.addEventListener("pause", (event) =>
          eventEmitter.emit(
            PAUSE,
            event,
            videoElement.currentTime,
            videoElement.played
          )
        )
        videoElement.addEventListener("seeking", (event) =>
          eventEmitter.emit(SEEKING, event, videoElement.currentTime)
        )
        videoElement.addEventListener("seeked", (event) =>
          eventEmitter.emit(SEEKED, event, videoElement.currentTime)
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
          videoElement.removeEventListener("loadedmetadata", (event) =>
            console.log("duration", videoElement.duration)
          )
          videoElement.removeEventListener("canplay", (event) =>
            eventEmitter.emit(CANPLAY, event, videoElement.currentTime)
          )
          videoElement.removeEventListener("play", (event) =>
            eventEmitter.emit(PLAY, event, videoElement.currentTime)
          )
          videoElement.removeEventListener("pause", (event) =>
            eventEmitter.emit(
              PAUSE,
              event,
              videoElement.currentTime,
              videoElement.played
            )
          )
          videoElement.removeEventListener("seeking", (event) =>
            eventEmitter.emit(SEEKING, event, videoElement.currentTime)
          )
          videoElement.removeEventListener("seeked", (event) =>
            eventEmitter.emit(SEEKED, event, videoElement.currentTime)
          )
          videoElement.removeEventListener("ended", (event) =>
            eventEmitter.emit(
              ENDED,
              event,
              videoElement.currentTime,
              videoElement.played
            )
          )
        }
        socket.disconnect()
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
          {!loading && (
            <ShakaPlayer autoplay={false} src={playUrl} ref={controllerRef} />
          )}
        </div>
      )}
    </div>
  )
}

function getPlayUrl(video, token) {
  const body = {
    videoId: JSON.parse(video).value,
  }
  const headers = { Authorization: `JWT ${token}` }
  return axios.post(`video-player-play`, body, {
    headers,
  })
}

export default PlayerContainer