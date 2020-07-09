import React, { useEffect, useState } from "react"
import * as ReactDOM from "react-dom"
import PlayerContainer from "./components/PlayerContainer"
import PlayerOverlay from "./components/PlayerOverlay"
import styled from "styled-components"
import Spinner from "@atlaskit/spinner"
const atlJwt = require("atlassian-jwt")

const VideoMacro = () => {
  const [title, setTitle] = useState("")
  const [assignedUsers, setAssignedUsers] = useState([])
  const [video, setVideo] = useState({})
  const [tenantId, setTenantId] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState("")

  useEffect(() => {
    AP.resize()
  }, [])

  useEffect(() => {
    AP.context.getToken(async (token) => {
      const decodedToken = atlJwt.decode(token, null, true)
      const tenantId = decodedToken.iss
      console.log("got TenantId", tenantId)
      const userId = decodedToken.sub ? decodedToken.sub : ""
      setCurrentUserId(userId)
      setTenantId(tenantId)
    })
  }, [])

  useEffect(() => {
    if (tenantId) {
      AP.confluence.getMacroData(function (data) {
        setTitle(data.title)
        setAssignedUsers(JSON.parse(data.users))
        setVideo(data.video)
        const videoObject = JSON.parse(data.video).value
        let num = 1
        const thumbnailUrl = `https://${process.env.S3_BUCKET_NAME}.s3-us-west-2.amazonaws.com/output/${tenantId}/${videoObject.id}/thumbnails/${videoObject.fileId}thumbnail.000000${num}.jpg`
        setThumbnailUrl(thumbnailUrl)
        setVideo(videoObject)
        setIsLoading(false)
      })
    }
  }, [tenantId])

  return (
    <MacroContainer>
      <h5>{title}</h5>
      {isLoading ? (
        <Spinner />
      ) : (
        <PlayerOverlay
          video={video}
          thumbnailUrl={thumbnailUrl}
          assignedUsers={assignedUsers}
          currentUser={currentUserId}
        />
      )}
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
