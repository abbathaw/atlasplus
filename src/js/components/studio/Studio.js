import React, { useState, useContext } from "react"
import * as ReactDOM from "react-dom"
import Tabs from "@atlaskit/tabs"
import VideosList from "./VideosList"
import UploadVideo from "./UploadVideo"

const TabSelectContext = React.createContext(null)
export const useTabSelectContext = () => useContext(TabSelectContext)

const Studio = () => {
  const [selectedTab, setSelectedTab] = useState({ tab: 0 })

  const tabs = [
    {
      label: "Upload Video",
      content: <UploadVideo />,
    },
    { label: "Videos", content: <VideosList /> },
  ]

  return (
    <div>
      <TabSelectContext.Provider value={{ selectedTab, setSelectedTab }}>
        <Tabs
          onSelect={(tab, index) => setSelectedTab({ tab: index })}
          selected={tabs[selectedTab.tab]}
          tabs={tabs}
        />
      </TabSelectContext.Provider>
    </div>
  )
}

export default Studio

const wrapper = document.getElementById("studio-container")
wrapper ? ReactDOM.render(<Studio />, wrapper) : false
