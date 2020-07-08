import React, { useEffect, useState } from "react"
import Drawer from "@atlaskit/drawer"
import HeatMap from "./HeatMap"

export const AnalyticsDrawer = ({ video, closeDrawer }) => {
  return (
    <Drawer onClose={closeDrawer} isOpen={true} width={"extended"}>
      <h1>I am an extended drawer of {video.name}</h1>
      <h2>Heat Map</h2>
      <HeatMap />
    </Drawer>
  )
}
