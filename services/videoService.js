import db from "../models"

const saveNewVideo = async (
  tenantId,
  userId,
  spaceId,
  fileId,
  videoId,
  name,
  size,
  fileType
) => {
  return await db.Video.create({
    id: videoId,
    tenantId,
    ownerId: userId,
    fileId,
    name,
    sizeInMb: size,
    status: "uploaded",
    sourceFileType: fileType,
    spaceId,
  }).then((created) => {
    console.log("created a new tenant with tenantI", created)
  })
}

const getTenantVideosBySpace = async (tenantId, spaceId) => {
  let videos = await db.Video.findAll({
    where: {
      tenantId,
      spaceId,
    },
  })
  console.log("The query: ", videos)
  return videos
}

const getFileExtension = (fileType) => {
  if (fileType === "video/quicktime") {
    return ".mov"
  } else if (fileType === "video/mp4") {
    return ".mp4"
  } else {
    return ""
  }
}

export { saveNewVideo, getFileExtension, getTenantVideosBySpace }
