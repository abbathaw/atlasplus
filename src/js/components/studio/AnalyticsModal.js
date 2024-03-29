import React from "react"
import HeatMap from "./HeatMap"
import Modal, { ModalTransition } from "@atlaskit/modal-dialog"
import { NoVideoDataWarning } from "./NoVideoDataWarning"

export const AnalyticsModal = ({
  video,
  closeModal,
  videoViewData,
  viewer,
}) => {
  const footerButtons = [{ text: "Close", onClick: closeModal }]

  return (
    <ModalTransition>
      <Modal
        actions={footerButtons}
        onClose={closeModal}
        heading={
          viewer
            ? `${video.name} Analytics for ${viewer}`
            : `${video.name} Analytics`
        }
        width={"xlarge"}
      >
        {videoViewData.length === 0 ? (
          <NoVideoDataWarning />
        ) : (
          <HeatMap videoViewData={videoViewData} viewer={viewer} />
        )}
      </Modal>
    </ModalTransition>
  )
}
