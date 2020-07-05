import { parseJwtInHeader } from "../services/jwt"
import { getUploadUrl } from "../services/aws"
import { saveNewVideo } from "../services/videoService"
const { v4: uuidv4 } = require("uuid")

export const uploadVideo = async (req, res) => {
  const identity = parseJwtInHeader(req)
  console.log("req", JSON.stringify(identity))
  const tenantId = identity.iss
  const userId = identity.sub ? identity.sub : ""
  const { space } = identity.context.confluence
  const { key: spaceKey, id: spaceId } = space

  const originalFileName = req.body.fileName
  const fileType = req.body.fileType
  const extension = originalFileName.split(".").pop()

  const fileName = uuidv4()
  const videoId = uuidv4()

  const file = {
    fileName,
    extension: extension ? `.${extension}` : "",
    fileType,
  }

  const presignedUrl = await getUploadUrl(tenantId, videoId, file)

  res.json({
    uploadUrl: presignedUrl,
    videoId,
    fileName,
  })
}

export const saveVideo = async (req, res) => {
  const identity = parseJwtInHeader(req)
  console.log("req", JSON.stringify(identity))
  const tenantId = identity.iss
  const userId = identity.sub ? identity.sub : ""
  const { space } = identity.context.confluence
  const { key: spaceKey, id: spaceId } = space

  const fileId = req.body.fileId
  const videoId = req.body.videoId
  const title = req.body.title
  const { fileSize } = req.body
  const size = fileSize && !isNaN(fileSize) ? fileSize / 1000000 : 0

  try {
    console.log("Saving video to db")
    await saveNewVideo(tenantId, userId, spaceId, fileId, videoId, title, size)
    res.status(201).send("created new video")
  } catch (e) {
    console.error("An error occurred saving the new video", e)
    res.status(500)
  }
}
