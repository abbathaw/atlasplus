import React, { useEffect, useState } from "react"
import HeatMap from "./HeatMap"
import Modal, { ModalTransition } from "@atlaskit/modal-dialog"

export const AnalyticsModal = ({ video, closeModal }) => {
  const footerButtons = [{ text: "Close", onClick: closeModal }]

  return (
    <ModalTransition>
      <Modal
        actions={footerButtons}
        onClose={closeModal}
        heading={`I am a modal of ${video.name} analytics`}
        height={1000}
      >
        <h2>Heat Map</h2>
        <HeatMap />
      </Modal>
    </ModalTransition>
  )
}
