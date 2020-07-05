import React from "react"
import * as ReactDOM from "react-dom"

const Studio = () => {
  return <div>Hello From Studio</div>
}

export default Studio

const wrapper = document.getElementById("studio-container")
wrapper ? ReactDOM.render(<Studio />, wrapper) : false
