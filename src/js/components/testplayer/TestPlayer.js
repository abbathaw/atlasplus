import React, { useEffect, useState } from "react"
import * as ReactDOM from "react-dom"
import PlayerContainer from "./TestPlayerContainer"

const JustPlayer = () => {
  const [video, setVideo] = useState({})

  useEffect(() => {
    const video = {
      title: "Video Title",
      id: "4e8fa8b4-591b-47dd-a23a-1d25a21c0b51",
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
