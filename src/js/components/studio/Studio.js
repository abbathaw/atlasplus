import React, { useState, useContext, useEffect } from "react"
import * as ReactDOM from "react-dom"
import Tabs from "@atlaskit/tabs"
import VideosList from "./VideosList"
import UploadVideo from "./UploadVideo"
import { AnalyticsModal } from "./AnalyticsModal"

const TabSelectContext = React.createContext(null)
const VideoAnalyticsModalContext = React.createContext(null)

export const useTabSelectContext = () => useContext(TabSelectContext)
export const useVideoAnalyticsModalContext = () =>
  useContext(VideoAnalyticsModalContext)

const Studio = () => {
  const [selectedTab, setSelectedTab] = useState({ tab: 0 })
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedVideoViewData, setSelectedVideoViewData] = useState([])

  useEffect(() => {
    AP.sizeToParent({ hideFooter: true }, () => {
      console.log("resizeddddd")
    })
  }, [])

  const openModal = (video, videoViewData) => {
    console.log("Modal videoViewData", videoViewData)
    setSelectedVideo(video)
    setSelectedVideoViewData(videoViewData)
    setIsAnalyticsModalOpen(true)
  }

  const closeModal = () => setIsAnalyticsModalOpen(false)

  const tabs = [
    {
      label: "Upload Video",
      content: <UploadVideo />,
    },
    { label: "Videos", content: <VideosList /> },
  ]

  return (
    <div style={{ height: "100%" }}>
      <VideoAnalyticsModalContext.Provider value={{ openModal }}>
        {selectedVideo && isAnalyticsModalOpen && (
          <AnalyticsModal
            video={selectedVideo}
            closeModal={closeModal}
            videoViewData={selectedVideoViewData}
          />
        )}
        <TabSelectContext.Provider value={{ selectedTab, setSelectedTab }}>
          <Tabs
            onSelect={(tab, index) => setSelectedTab({ tab: index })}
            selected={tabs[selectedTab.tab]}
            tabs={tabs}
          />
        </TabSelectContext.Provider>
      </VideoAnalyticsModalContext.Provider>
    </div>
  )
}

export default Studio

const wrapper = document.getElementById("studio-container")
wrapper ? ReactDOM.render(<Studio />, wrapper) : false
