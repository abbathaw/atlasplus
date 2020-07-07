import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import "shaka-player/dist/controls.css"
import ShakaPlayer from "../macro/components/ShakaPlayer"
import {
  CANPLAY,
  ENDED,
  initEmitter,
  PAUSE,
  PLAY,
  SEEKED,
  SEEKING,
} from "../../services/EventService"

import socketIOClient from "socket.io-client"
const ENDPOINT = "ws://atlasplus.ap.ngrok.io/analytics"

const PlayerContainer = ({ video }) => {
  const [playUrl, setPlayUrl] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = React.useState(true)
  const controllerRef = useRef()

  useEffect(() => {
    if (video && video.id) {
      getPlayUrl(video)
        .then((res) => {
          setPlayUrl(res.data.url)
          setLoading(false)
        })
        .catch((e) => {
          console.error("Some error happened getting the play url", e)
          setError("An error happened")
        })
    }
  }, [video])

  useEffect(() => {
    if (!loading) {
      const socket = socketIOClient(ENDPOINT, {
        upgrade: false,
        transports: ["websocket"],
      })
      socket.on("connect", () => {
        socket.emit("storeClientInfo", { customId: "dadasdas" })
        // either with send()
        socket.send("Hello!")

        // or with emit() and custom event names
        socket.emit(
          "salutations",
          "Hello!",
          { mr: "john" },
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

      // videoElement.addEventListener("pause", (event)=> console.log(` start ${videoElement.played.start(0)} end ${videoElement.played.end(0)}`))

      // // videoElement.addEventListener('loadedmetadata', function() {
      // //   videoElement.currentTime = 5;
      // // }, false);
      // videoElement.addEventListener("seeking", (state)=>console.log("seeking", state))
      // videoElement.addEventListener("seeked", (state)=>console.log(`seeked played: ${JSON.stringify(videoElement.played)} - currentTime${videoElement.currentTime}`, state))
      // videoElement.addEventListener("canplay", (state)=>console.log("canplay", state))
      // videoElement.addEventListener("ended", (state)=>console.log("end", videoElement.played.length))
      // videoElement.addEventListener("timeupdate", (state)=>console.log("timeupdate", state))

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
    }
  }, [loading])

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <div>
          {" "}
          {!loading && (
            <ShakaPlayer autoplay={false} src={playUrl} ref={controllerRef} />
          )}
        </div>
      )}
    </div>
  )
}

function getPlayUrl(video) {
  const body = {
    videoId: video.id,
  }
  return axios.post(`video-player-play-test`, body)
}

export default PlayerContainer
