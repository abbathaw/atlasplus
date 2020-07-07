import React, { useEffect, useState } from "react"
import * as ReactDOM from "react-dom"
import SectionMessage from "@atlaskit/section-message"
import Button from "@atlaskit/button"
import EditorOpenIcon from "@atlaskit/icon/glyph/editor/open"

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
        macro, upload your video content from the{" "}
        <Button
          appearance={"link"}
          href={`${locationPrefix}/customcontent/list/ac%3Aatlasplus%3Astudio`}
          target={"_blank"}
          iconAfter={<EditorOpenIcon size={"small"} label={""} />}
          spacing={"none"}
        >
          Video Studio.
        </Button>
      </p>
    </SectionMessage>
  )
}
