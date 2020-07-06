import React, { useEffect, useState } from "react"
import * as ReactDOM from "react-dom"
import PlayerContainer from "./components/PlayerContainer"

const VideoMacro = () => {
  const [title, setTitle] = useState("")
  const [assignedUsers, setAssignedUsers] = useState([])
  const [video, setVideo] = useState({})

  useEffect(() => {
    AP.confluence.getMacroData(function (data) {
      console.log("MACRO DATA _________>", data)
      setTitle(data.title)
      setAssignedUsers(data.users)
      const video = {
        title: "Video Title",
        id: "d926d13b-7b26-4ff6-a07b-4574b909b5cc",
      }
      setVideo(video)
    })
  }, [])

  return (
    <div className="aui-item">
      <h5>{title}</h5>
      <PlayerContainer video={video} />
    </div>
  )
}

function getQueryParams() {
  let paramsObj = {}
  let paramsArr = location.search.slice(1).split("&")
  paramsArr.forEach((param) => {
    paramsObj[param.split("=")[0]] = param.split("=")[1]
  })
  return paramsObj
}

function render() {
  const params = getQueryParams()
  ReactDOM.render(<VideoMacro />, document.getElementById(params.macroId))
}

if (
  ["complete", "loaded", "interactive"].includes(document.readyState) &&
  document.body
) {
  render()
} else {
  window.addEventListener("DOMContentLoaded", render, false)
}
