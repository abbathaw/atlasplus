import React from "react"
import * as ReactDOM from "react-dom"

const GetStarted = () => {
  return <div>Lets get started!</div>
}

function render() {
  ReactDOM.render(<GetStarted />, document.getElementById("get-started"))
}

if (
  ["complete", "loaded", "interactive"].includes(document.readyState) &&
  document.body
) {
  render()
} else {
  window.addEventListener("DOMContentLoaded", render, false)
}
