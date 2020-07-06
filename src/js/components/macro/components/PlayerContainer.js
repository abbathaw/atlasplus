import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import ShakaPlayer from "./ShakaPlayer"
import "shaka-player/dist/controls.css"
const PlayerContainer = ({ video }) => {
  const [playUrl, setPlayUrl] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = React.useState(true)
  // const controllerRef = useRef(null);

  useEffect(() => {
    if (video && video.id) {
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

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <div style={{ height: "700px", width: "100%" }}>
          {" "}
          {!loading && <ShakaPlayer autoplay={false} src={playUrl} />}
        </div>
      )}
    </div>
  )
}

function getPlayUrl(video, token) {
  const body = {
    videoId: video.id,
  }
  const headers = { Authorization: `JWT ${token}` }
  return axios.post(`video-player-play`, body, {
    headers,
  })
}

export default PlayerContainer
