import React from "react"
import shaka from "shaka-player/dist/shaka-player.ui"
import axios from "axios"

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

const ShakaPlayer = ({ src, autoPlay, drmToken, videoId, isSubtitle }, ref) => {
  const uiContainerRef = React.useRef(null)
  const videoRef = React.useRef(null)
  const controller = React.useRef({})

  const config = {
    manifest: {
      dash: {},
    },
    drm: {
      servers: {
        "com.widevine.alpha":
          "https://license.pallycon.com/ri/licenseManager.do",
      },
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
      if (drmToken) {
        player
          .getNetworkingEngine()
          .registerRequestFilter(function (type, request) {
            // Only add headers to license requests:
            if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
              // This is the specific header name and value the server wants:
              request.headers["pallycon-customdata-v2"] = drmToken
            }
          })
      }
      player.configure(config)
    }
  }, [config, drmToken])

  // Load the source url when we have one.
  React.useEffect(() => {
    const { player } = controller.current
    if (player) {
      player
        .load(src)
        .then(async () => {
          try {
            if (isSubtitle) {
              const maybeSubtitleFile = `https://${process.env.CLOUDFRONT_DOMAIN}/output/subtitles/${videoId}.vtt`
              const checkFileExists = axios
                .get(maybeSubtitleFile)
                .then(async function (response) {
                  // handle success
                  console.log("Found subtitle file")
                  const subtitle = await player.addTextTrack(
                    maybeSubtitleFile,
                    "eng",
                    "subtitle",
                    "text/vtt"
                  )
                  player.selectTextTrack(subtitle)
                  player.setTextTrackVisibility(true)
                })
                .catch(function (error) {
                  // handle error
                  console.log(error)
                })
            }
          } catch (err) {
            console.log(
              "Error happened getting subtitle file. Shouldnt affect playback",
              err
            )
          }

          console.log("player", player.getTextTracks())
        })
        .catch((error) => {
          console.log("shaka player error", error)
        })
    }
  }, [src, isSubtitle])

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
        style={{ maxWidth: "100%", maxHeight: "480px" }}
      >
        {/*<track src="https://atlasplus.ap.ngrok.io/subtitles/test.vtt" kind="subtitles" srcLang="en" label="English" />*/}
      </video>
    </div>
  )
}

export default React.forwardRef(ShakaPlayer)
