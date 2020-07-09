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

const Landing = ({ videoId, token, title, isDrm }) => {
  const classes = useStyles()

  console.log("Received props", videoId, token, title)

  const handleEndShow = () => {
    console.log("video ended")
    window.close()
  }

  return (
    <Container>
      <Card className={classes.card}>
        <CardHeader title={title} />
        <CardContent>
          <PlayerContainer
            videoIdProps={videoId}
            isAutoPlay={false}
            setEnded={handleEndShow}
            jwtToken={token}
            isDrm={isDrm}
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
wrapper
  ? ReactDOM.render(
      <Landing videoId={videoId} token={token} title={title} isDrm={isDrm} />,
      wrapper
    )
  : false
