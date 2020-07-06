import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import "shaka-player/dist/controls.css"
import ShakaPlayer from "../macro/components/ShakaPlayer"
const PlayerContainer = ({ video }) => {
  const [playUrl, setPlayUrl] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = React.useState(true)
  // const controllerRef = useRef(null);

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

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <div> {!loading && <ShakaPlayer autoplay={false} src={playUrl} />}</div>
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
