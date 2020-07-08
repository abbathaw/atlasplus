import React from "react"
import shaka from "shaka-player/dist/shaka-player.ui"
// import "shaka-player/dist/controls.css"

/**
 * A React component for shaka-player.
 * @param {string} src
 * @param {shaka.extern.PlayerConfiguration} config
 * @param {boolean} autoPlay
 * @param {number} width
 * @param {number} height
 * @param ref
 * @returns {*}
 * @constructor
 */

const ShakaPlayer = ({ src, autoPlay }, ref) => {
  const uiContainerRef = React.useRef(null)
  const videoRef = React.useRef(null)
  const controller = React.useRef({})

  const config = {
    manifest: {
      dash: {},
    },
  }

  // Effect to handle component mount & mount.
  // Not related to the src prop, this hook creates a shaka.Player instance.
  // This should always be the first effect to run.
  React.useEffect(() => {
    const player = new shaka.Player(videoRef.current)
    const ui = new shaka.ui.Overlay(
      player,
      uiContainerRef.current,
      videoRef.current
    )

    // Store Shaka's API in order to expose it as a handle.
    controller.current = { player, ui, videoElement: videoRef.current }
    return () => {
      player.destroy()
      ui.destroy()
    }
  }, [])

  // // Keep shaka.Player.configure in sync.
  React.useEffect(() => {
    const { player } = controller.current
    if (player) {
      player.configure(config)
    }
  }, [config])

  // Load the source url when we have one.
  React.useEffect(() => {
    const { player } = controller.current
    if (player) {
      console.log("what is src", src)
      player.load(src)
    }
  }, [src])

  // Define a handle for easily referencing Shaka's player & ui API's.
  React.useImperativeHandle(ref, () => ({
    getVideoElement: () => controller.current.videoElement,
    player: () => controller.current.player,
    // get player() {
    //   return controller.current.player;
    // },
    // get ui() {
    //   return controller.current.ui;
    // },
    // get videoElement() {
    //   return controller.current.videoElement;
    // },
  }))

  return (
    <div ref={uiContainerRef}>
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        width="100%"
        height="100%"
        style={{ maxWidth: "100%" }}
      />
    </div>
  )
}

export default React.forwardRef(ShakaPlayer)
