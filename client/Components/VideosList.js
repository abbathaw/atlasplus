import React from "react"
import { useTabSelectContext } from "../Studio"

const VideosList = () => {
  const { setSelectedTab } = useTabSelectContext()
  return (
    <div>
      Video List
      <button onClick={() => setSelectedTab({ tab: 0 })}>Upload a video</button>
    </div>
  )
}

export default VideosList
