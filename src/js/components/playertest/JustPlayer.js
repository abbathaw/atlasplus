import React, { useEffect, useState } from "react"
import * as ReactDOM from "react-dom"
import PlayerContainer from "./PlayerContainer"

const JustPlayer = () => {
  const [video, setVideo] = useState({})

  useEffect(() => {
    const video = {
      title: "Video Title",
      id: "d926d13b-7b26-4ff6-a07b-4574b909b5cc",
    }
    setVideo(video)
  }, [])

  return (
    <div className="aui-item">
      <h5>{video.title}</h5>
      <PlayerContainer video={video} />
    </div>
  )
}

export default JustPlayer

const wrapper = document.getElementById("just-player-container")
wrapper ? ReactDOM.render(<JustPlayer />, wrapper) : false
