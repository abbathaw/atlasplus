import React, {useEffect, useState} from "react";
import * as ReactDOM from 'react-dom';


const VideoMacro = () => {

  const [title, setTitle] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [video, setVideo] = useState("");

  useEffect(() => {
    AP.confluence.getMacroData(function (data) {
      console.log('MACRO DATA _________>', data)
      setTitle(data.title);
      setAssignedUsers(data.users);
      setVideo(data.video)
    });
  }, []);

  return (
    <div className="aui-item">
      <p>Hi from video macro with:</p>
      <ol id="somePara">
        <li>
          title={title}
        </li>
        <li>
          users={assignedUsers}
        </li>
        <li>
          video={video}
        </li>
      </ol>
    </div>
  )

}

function getQueryParams() {
  let paramsObj = {};
  let paramsArr = location.search.slice(1).split('&');
  paramsArr.forEach(param => {
    paramsObj[param.split('=')[0]] = param.split('=')[1]
  });
  return paramsObj
}

function render() {
  const params = getQueryParams();
  ReactDOM.render(
    <VideoMacro/>,
    document.getElementById(params.macroId)
  );
}

if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
  render();
} else {
  window.addEventListener('DOMContentLoaded', render, false);
}