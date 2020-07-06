import React, { useEffect, useRef, useState } from "react"
import * as ReactDOM from "react-dom"
import Form, { HelperMessage, FormFooter, Field } from "@atlaskit/form"
import TextField from "@atlaskit/textfield"
import Select, { AsyncSelect } from "@atlaskit/select"
import Spinner from "@atlaskit/spinner"
import Button from "@atlaskit/button"
import axios from "axios"
import { NoVideosWarning } from "./NoVideosWarning"

const VideoMacroEditor = () => {
  const [title, setTitle] = useState("")
  const [assignedUsers, setAssignedUsers] = useState([])
  const editorFormSubmitButtonEl = useRef(null)
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    //get Space Key from URL
    AP.getLocation((location) => {
      const spaceKey = location.split("/spaces/")[1].split("/")[0]

      // get Space id from space key
      AP.request(`/rest/api/space/${spaceKey}`).then((data) => {
        let body = JSON.parse(data.body)
        console.log("space id", body.id)
        //get Token and call backend
        AP.context.getToken(async (token) => {
          const {
            data: spaceVideos,
          } = await axios.get(`video-studio/spaceVideos?spaceId=${body.id}`, {
            headers: { Authorization: `JWT ${token}` },
          })
          console.log("available videos-------------->", spaceVideos)
          setIsLoading(false)
          setVideos(
            spaceVideos.map((video) => {
              return {
                label: video.name,
                value: video.id,
              }
            })
          )
        })
      })
    })
  }, [])

  const submitForm = () => editorFormSubmitButtonEl.current.click()

  useEffect(() => {
    getMacroData()
    AP.dialog.getButton("submit").bind(submitForm)
  }, [])

  const getMacroData = () => {
    AP.confluence.getMacroData(({ title, users, video }) => {
      console.log("MACRO DATA EDITOR_________>", title, users, video)
      title && setTitle(title)
      users && setAssignedUsers(JSON.parse(users))
      video && setSelectedVideo(JSON.parse(video))
    })
  }

  const saveMacro = (data) => {
    let macroParams = {
      title: data.title,
      users: JSON.stringify(data.users),
      video: JSON.stringify(data.video),
    }
    console.log("MACRO PARAMS________>", macroParams)
    AP.confluence.saveMacro(macroParams)
    AP.confluence.closeMacroEditor()
  }

  const userLookup = async (input) => {
    if (input.length > 2) {
      let searchedUsers
      searchedUsers = await AP.request(
        `/rest/api/search?limit=6&cql=user.fullname~%22${input}%22`
      )
      searchedUsers = JSON.parse(searchedUsers.body).results
      return searchedUsers.map((searchedUser) => ({
        label: searchedUser.user.publicName,
        value: searchedUser.user.accountId,
      }))
    }
  }

  const promiseOptions = (input) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(userLookup(input))
      }, 1000)
    })

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : videos.length === 0 ? (
        <NoVideosWarning />
      ) : (
        <Form onSubmit={saveMacro}>
          {({ formProps }) => (
            <form {...formProps}>
              <Field
                name="title"
                defaultValue={title}
                label="Video Title"
                isRequired
              >
                {({ fieldProps }) => (
                  <>
                    <TextField {...fieldProps} />
                    <HelperMessage>Title to describe the video.</HelperMessage>
                  </>
                )}
              </Field>
              <Field
                name="users"
                defaultValue={assignedUsers}
                label="Assigned User(s)"
                isRequired
              >
                {({ fieldProps }) => (
                  <>
                    <AsyncSelect
                      {...fieldProps}
                      className="async-select-with-callback"
                      classNamePrefix="react-select"
                      loadOptions={promiseOptions}
                      placeholder="Select users"
                      isMulti
                    />
                    <HelperMessage>
                      Users assigned to view the video.
                    </HelperMessage>
                  </>
                )}
              </Field>
              <Field
                name="video"
                defaultValue={selectedVideo}
                label="Video"
                isRequired
              >
                {({ fieldProps }) => (
                  <>
                    <Select
                      {...fieldProps}
                      className="single-select"
                      classNamePrefix="react-select"
                      options={videos}
                      placeholder="Choose a Video"
                    />
                    <HelperMessage>
                      Select the video you would like to play.
                    </HelperMessage>
                  </>
                )}
              </Field>
              <button
                hidden={true}
                type={"submit"}
                ref={editorFormSubmitButtonEl}
              />
            </form>
          )}
        </Form>
      )}
    </>
  )
}

function render() {
  ReactDOM.render(
    <VideoMacroEditor />,
    document.getElementById("video-macro-editor")
  )
}

if (
  ["complete", "loaded", "interactive"].includes(document.readyState) &&
  document.body
) {
  render()
} else {
  window.addEventListener("DOMContentLoaded", render, false)
}
