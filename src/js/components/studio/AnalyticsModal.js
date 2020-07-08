import React, { useEffect, useState } from "react"
import HeatMap from "./HeatMap"
import Modal, { ModalTransition } from "@atlaskit/modal-dialog"
import { NoVideoDataWarning } from "./NoVideoDataWarning"

export const AnalyticsModal = ({ video, closeModal, videoViewData }) => {
  const footerButtons = [{ text: "Close", onClick: closeModal }]

  return (
    <ModalTransition>
      <Modal
        actions={footerButtons}
        onClose={closeModal}
        heading={`${video.name} analytics`}
        width={"xlarge"}
      >
        {videoViewData.length === 0 ? (
          <NoVideoDataWarning />
        ) : (
          <HeatMap videoViewData={videoViewData} />
        )}
      </Modal>
    </ModalTransition>
  )
}
