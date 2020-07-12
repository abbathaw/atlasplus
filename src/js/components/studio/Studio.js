import React, { useState, useContext, useEffect } from "react"
import * as ReactDOM from "react-dom"
import Tabs from "@atlaskit/tabs"
import VideosList from "./VideosList"
import UploadVideo from "./UploadVideo"
import { AnalyticsModal } from "./AnalyticsModal"
import VideoUserAnalyticsTable from "./VideoUserAnalyticsTable"

const TabSelectContext = React.createContext(null)
const VideoAnalyticsModalContext = React.createContext(null)

export const useTabSelectContext = () => useContext(TabSelectContext)
export const useVideoAnalyticsModalContext = () =>
  useContext(VideoAnalyticsModalContext)

const Studio = () => {
  const [selectedTab, setSelectedTab] = useState({ tab: 0 })
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)
  const [
    isUserAnalyticsTableDisplayed,
    setIsUserAnalyticsTableDisplayed,
  ] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedVideoViewData, setSelectedVideoViewData] = useState([])
  const [
    selectedVideoViewDataForUser,
    setSelectedVideoViewDataForUser,
  ] = useState([])
  const [selectedViewer, setSelectedViewer] = useState("")

  useEffect(() => {
    AP.sizeToParent({ hideFooter: true }, () => {
      console.log("Container Resized")
    })
  }, [])

  const openModal = (video, videoViewData, viewer = "") => {
    setSelectedVideo(video)
    setIsAnalyticsModalOpen(true)
    viewer
      ? setSelectedVideoViewDataForUser(videoViewData)
      : setSelectedVideoViewData(videoViewData)
    viewer && setSelectedViewer(viewer)
  }

  const closeModal = () => {
    setIsAnalyticsModalOpen(false)
    setSelectedViewer("")
  }

  const loadWatchersTable = (video, videoViewData) => {
    setSelectedVideo(video)
    setSelectedVideoViewData(videoViewData)
    setIsUserAnalyticsTableDisplayed(true)
  }

  const closeWatchersTable = () => setIsUserAnalyticsTableDisplayed(false)

  const tabs = [
    {
      label: "Upload Video",
      content: <UploadVideo />,
    },
    { label: "Videos", content: <VideosList /> },
  ]

  return (
    <div style={{ height: "100%" }}>
      <VideoAnalyticsModalContext.Provider
        value={{ openModal, loadWatchersTable }}
      >
        {selectedVideo && isAnalyticsModalOpen && (
          <AnalyticsModal
            video={selectedVideo}
            closeModal={closeModal}
            videoViewData={
              selectedViewer
                ? selectedVideoViewDataForUser
                : selectedVideoViewData
            }
            viewer={selectedViewer}
          />
        )}
        <TabSelectContext.Provider value={{ selectedTab, setSelectedTab }}>
          {!isUserAnalyticsTableDisplayed && (
            <Tabs
              onSelect={(tab, index) => setSelectedTab({ tab: index })}
              selected={tabs[selectedTab.tab]}
              tabs={tabs}
            />
          )}
        </TabSelectContext.Provider>
        {selectedVideo && isUserAnalyticsTableDisplayed && (
          <VideoUserAnalyticsTable
            video={selectedVideo}
            videoViewData={selectedVideoViewData}
            closeWatchersTable={closeWatchersTable}
          />
        )}
      </VideoAnalyticsModalContext.Provider>
    </div>
  )
}

export default Studio

const wrapper = document.getElementById("studio-container")
wrapper ? ReactDOM.render(<Studio />, wrapper) : false
