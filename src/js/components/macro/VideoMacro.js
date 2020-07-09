import React, { useEffect, useState } from "react"
import * as ReactDOM from "react-dom"
import PlayerContainer from "./components/PlayerContainer"
import PlayerOverlay from "./components/PlayerOverlay"
import styled from "styled-components"
const VideoMacro = () => {
  const [title, setTitle] = useState("")
  const [assignedUsers, setAssignedUsers] = useState([])
  const [video, setVideo] = useState("")

  useEffect(() => {
    AP.resize()
  }, [])

  useEffect(() => {
    AP.confluence.getMacroData(function (data) {
      console.log("MACRO DATA _________>", data)
      setTitle(data.title)
      setAssignedUsers(data.users)
      setVideo(data.video)
      // const videoId =  JSON.parse(data).video.value
    })
  }, [])

  return (
    <MacroContainer>
      <h5>{title}</h5>
      <PlayerContainer video={video} />
    </MacroContainer>
  )
}

const MacroContainer = styled.div`
  width: 100%;
  height: 500px;
`

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
