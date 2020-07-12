import React, { useState, useEffect } from "react"
import * as ReactDOM from "react-dom"

import styled from "styled-components"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import PlayerContainer from "../macro/components/PlayerContainer"

const Container = styled.div`
  margin: 30px;
  height: 90vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  justify-items: center;
`

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      height: "85%",
      minWidth: "60%",
      maxWidth: "900px",
    },
  })
)

const Landing = ({ videoId, token, title, isDrm, isSubtitle }) => {
  const classes = useStyles()
  const [browser, setBrowser] = useState("")
  const [unSafeBrowser, setUnSafeBrowser] = useState(false)

  useEffect(() => {
    const browser = (function () {
      const test = function (regexpOrCss) {
        return regexpOrCss instanceof RegExp
          ? regexpOrCss.test(window.navigator.userAgent)
          : window.CSS &&
              window.CSS.supports &&
              window.CSS.supports(regexpOrCss)
      }
      switch (true) {
        case test(/edg/i):
          return "Edge"
        case test(/trident/i):
          return "IE"
        case test(/opr/i) && (!!window.opr || !!window.opera):
          return "Opera"
        case test("(-webkit-touch-callout: none)"):
          return "ios-safari"
        case test(/chrome/i) && !!window.chrome:
          return "Chrome"
        case test(/firefox/i):
          return "Firefox"
        case test(/safari/i):
          return "Safari"
        default:
          return "other"
      }
    })()
    console.log("browser detected", browser)
    if (browser === "Firefox" || browser === "Chrome") {
      setUnSafeBrowser(false)
      setBrowser(browser)
    } else {
      setUnSafeBrowser(true)
      setBrowser(browser)
    }
  }, [])

  const handleEndShow = () => {
    window.close()
  }

  return (
    <Container>
      <Card className={classes.card}>
        <CardHeader
          title={title}
          subheader={
            unSafeBrowser
              ? `We have detected that your browser is ${browser}. At the moment, we are only supporting DRM content on Chrome, or Firefox browsers, so this content might not work properly. We are sorry for the inconvenience`
              : ``
          }
        />
        <CardContent>
          <PlayerContainer
            videoIdProps={videoId}
            isAutoPlay={false}
            setEnded={handleEndShow}
            jwtToken={token}
            isDrm={isDrm}
            isSubtitle={isSubtitle}
          />
        </CardContent>
      </Card>
    </Container>
  )
}

export default Landing
const wrapper = document.getElementById("external-player-container")
const videoId = wrapper.getAttribute("data-videoid")
const token = wrapper.getAttribute("data-token")
const title = wrapper.getAttribute("data-title")
const isDrm = wrapper.getAttribute("data-isdrm")
const isSubtitle = wrapper.getAttribute("data-issubtitle")
wrapper
  ? ReactDOM.render(
      <Landing
        videoId={videoId}
        token={token}
        title={title}
        isDrm={isDrm}
        isSubtitle={isSubtitle}
      />,
      wrapper
    )
  : false
