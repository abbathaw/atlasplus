import React from "react"
import * as ReactDOM from "react-dom"

const Configuration = () => {
  return <div>Configure your experience!</div>
}

function render() {
  ReactDOM.render(<Configuration/>, document.getElementById('configuration'));
}

if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
  render();
} else {
  window.addEventListener('DOMContentLoaded', render, false);
}