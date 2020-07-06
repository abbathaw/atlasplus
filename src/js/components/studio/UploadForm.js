import React, { useState, useEffect, useRef } from "react"
import Button from "@atlaskit/button"
import styled from "styled-components"
import Spinner from "@atlaskit/spinner"
import "react-sweet-progress/lib/style.css"
import InlineMessage from "@atlaskit/inline-message"
import { Progress } from "react-sweet-progress"
import axios from "axios"

// let cancelToken = axios.CancelToken
// let source = cancelToken.source()

const UploadForm = ({ resetForm }) => {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")
  const [fileUploading, setFileUploading] = useState(false)
  const [loaded, setLoaded] = useState(0)
  const cancelToken = useRef(null)

  useEffect(() => {}, [])

  const showFlag = () => {
    AP.flag.create({
      title: "Video Successfully Uploaded",
      body: "We will notify you once the video is ready.",
      type: "success",
    })
  }

  const handleUpload = async (event) => {
    event.preventDefault()
    setError("")
    if (fileUploading) {
      return null
    }

    console.log("data title", title)
    console.log("data file", file)

    if (title && file) {
      cancelToken.current = axios.CancelToken.source()
      setFileUploading(true)

      //get Token to call backend
      AP.context.getToken(async function (token) {
        try {
          //get S3 presigned UploadUrl
          const { data: uploadData } = await getUploadData(token)

          //uploadFileToS3
          const uploadTask = await uploadVideo(uploadData)

          if (uploadTask.status === 200) {
            console.log("upload success")

            //Submit Success back to server
            const saved = await saveVideo(token, uploadData)
            console.log("saved video", saved)
            refreshForm()
            showFlag()
          } else {
            console.error("Upload error", uploadTask.status)
            setError("An error occurred while uploading the file")
          }
        } catch (e) {
          console.error("someError", e)
        }
      })
    } else {
      setError("Please select a file and include a title")
    }
  }

  const getUploadData = async (token) => {
    const body = {
      fileType: file.type,
    }
    const headers = { Authorization: `JWT ${token}` }
    return await axios.post(`video-studio/getPresignedUploadUrl`, body, {
      headers,
    })
  }

  const uploadVideo = async (uploadData) => {
    const uploadOptions = {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        setLoaded((progressEvent.loaded / progressEvent.total) * 100)
      },
      cancelToken: cancelToken.current.token,
    }
    return await axios.put(uploadData.uploadUrl, file, uploadOptions)
  }

  const saveVideo = async (token, uploadData) => {
    const body = {
      fileId: uploadData.fileName,
      videoId: uploadData.videoId,
      title,
      fileSize: file.size,
      fileType: file.type,
    }
    const headers = { Authorization: `JWT ${token}` }
    return await axios.post(`video-studio/saveVideo`, body, { headers })
  }

  const handleFileSelect = () => {
    document.getElementById("atlasPlus-video-input").click()
  }

  const cancelRequest = () => {
    console.log("User trigger upload cancel")
    cancelToken.current.cancel("Upload cancelled by the user")
    refreshForm()
  }

  const refreshForm = () => {
    setFileUploading(false)
    setLoaded(0)
    setError("")
    setTitle("")
    setFile(null)
  }

  return (
    <div>
      <form style={{ width: "450px" }} onSubmit={handleUpload}>
        <div style={{ marginTop: "20px" }}>
          <Button
            appearance={"primary"}
            onClick={handleFileSelect}
            shouldFitContainer={true}
            isDisabled={fileUploading}
          >
            Select Video
          </Button>
          {file && (
            <div>
              <InlineMessage
                title={file.name}
                type="confirmation"
              ></InlineMessage>
            </div>
          )}
          {!fileUploading && (
            <FileInput
              onChange={(e) => setFile(e.target.files[0])}
              placeholder="Video"
              type="file"
              name="file"
              id="atlasPlus-video-input"
              accept=".mov,.mp4"
            />
          )}
        </div>
        <div style={{ marginTop: "20px" }}>
          <Label for={"videoTitle"}>Video Title</Label>
          <TextInput
            type="text"
            id={"videoTitle"}
            name={"videoTitle"}
            value={title}
            disabled={fileUploading}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          {error && (
            <div>
              <InlineMessage title={error} type="warning"></InlineMessage>
            </div>
          )}
          {!fileUploading && (
            <Button
              appearance={"default"}
              type="submit"
              style={{ float: "right" }}
              isDisabled={fileUploading}
            >
              Upload
            </Button>
          )}
        </div>
      </form>
      <div
        style={{
          marginTop: "10px",
        }}
      >
        {fileUploading && (
          <React.Fragment>
            <Progress percent={Math.round(loaded)} />
            <Button
              appearance={"subtle"}
              onClick={cancelRequest}
              style={{ float: "right" }}
            >
              Cancel
            </Button>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

const Label = styled.label`
  color: #6b778c;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  padding: 3px;
`
const TextInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`
const FileInput = styled.input`
  display: none;
`

export default UploadForm
