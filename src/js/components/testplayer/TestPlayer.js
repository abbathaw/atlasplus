import React, { useEffect, useState } from "react"
import * as ReactDOM from "react-dom"
import PlayerContainer from "./TestPlayerContainer"

const JustPlayer = () => {
  const [video, setVideo] = useState({})

  useEffect(() => {
    const video = {
      title: "Video Title",
      id: "ca0da826-23fc-46d6-bf31-1af5c0006d58",
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
