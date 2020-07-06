import React, { useEffect, useState } from "react"
import * as ReactDOM from "react-dom"
import SectionMessage from "@atlaskit/section-message"

export const NoVideosWarning = () => {
  const [locationPrefix, setLocationPrefix] = useState("")

  useEffect(() => {
    let mounted = true
    AP.getLocation((location) => {
      mounted &&
        setLocationPrefix(
          location.split("/pages/")[0].replace("/spaces/", "/display/")
        )
    })
    return () => (mounted = false)
  }, [])

  return (
    <SectionMessage appearance="warning">
      <p>
        It seems that no videos have been uploaded to this space. To use this
        macro, upload your video content from{" "}
        <a
          href={`${locationPrefix}/customcontent/list/ac%3Aatlasplus%3Astudio`}
          target={"_blank"}
        >
          here
        </a>
        .
      </p>
    </SectionMessage>
  )
}
