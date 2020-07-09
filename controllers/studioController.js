import { parseJwtInHeader } from "../services/jwt"
import { getThumbnails, getUploadUrl } from "../services/aws"
import {
  getFileExtension,
  getTenantVideosBySpace,
  saveNewVideo,
} from "../services/videoService"
import { triggerEncoderJob } from "../services/jobService"
import { getEnrollmentsByVideoId } from "../services/enrollmentService"

const { v4: uuidv4 } = require("uuid")

const getUploadPresignedUrl = async (req, res) => {
  const identity = parseJwtInHeader(req)
  console.log("req", JSON.stringify(identity))
  const tenantId = identity.iss
  const userId = identity.sub ? identity.sub : ""
  const { space } = identity.context.confluence
  const { key: spaceKey, id: spaceId } = space

  const fileType = req.body.fileType
  const extension = getFileExtension(fileType)

  const fileName = uuidv4()
  const videoId = uuidv4()

  const file = {
    fileName,
    extension,
    fileType,
  }

  const presignedUrl = await getUploadUrl(tenantId, videoId, file)

  res.json({
    uploadUrl: presignedUrl,
    videoId,
    fileName,
  })
}

const saveVideo = async (req, res) => {
  const identity = parseJwtInHeader(req)
  console.log("req", JSON.stringify(identity))
  const tenantId = identity.iss
  const userId = identity.sub ? identity.sub : ""
  const { space } = identity.context.confluence
  const { key: spaceKey, id: spaceId } = space

  const fileId = req.body.fileId
  const videoId = req.body.videoId
  const title = req.body.title
  const fileType = req.body.fileType
  const { fileSize } = req.body
  const size = fileSize && !isNaN(fileSize) ? fileSize / 1000000 : 0

  try {
    console.log("Saving video to db")
    await saveNewVideo(
      tenantId,
      userId,
      spaceId,
      fileId,
      videoId,
      title,
      size,
      fileType
    )
    await triggerEncoderJob(
      tenantId,
      videoId,
      fileId,
      getFileExtension(fileType)
    )
    res.status(201).send("created new video")
  } catch (e) {
    console.error("An error occurred saving the new video", e)
    res.status(500)
  }
}

const getSpaceVideos = async (req, res) => {
  const { iss: tenantId, context } = parseJwtInHeader(req)
  const spaceId = req.query.spaceId
    ? req.query.spaceId
    : context.confluence.space.id
  res.json(await getTenantVideosBySpace(tenantId, spaceId))
}

const getVideoThumbnails = (req, res) => {
  const { iss: tenantId } = parseJwtInHeader(req)
  const videoId = req.query.videoId
  getThumbnails(tenantId, videoId, (signedUrl) => {
    res.json({ thumbnailUrl: signedUrl })
  })
}

const getVideoViewData = async (req, res) => {
  const videoId = req.query.videoId
  const enrollments = await getEnrollmentsByVideoId(videoId)
  res.json({ enrollments })
}

export {
  getUploadPresignedUrl,
  saveVideo,
  getSpaceVideos,
  getVideoThumbnails,
  getVideoViewData,
}
