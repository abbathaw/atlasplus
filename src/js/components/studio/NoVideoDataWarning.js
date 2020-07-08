import React from "react"
import * as ReactDOM from "react-dom"
import SectionMessage from "@atlaskit/section-message"

export const NoVideoDataWarning = () => {
  return (
    <SectionMessage appearance="warning">
      <p>
        It seems that no view data has been generated for this video yet.
        Revisit this page once more users have had a chance to view the video.
      </p>
    </SectionMessage>
  )
}
