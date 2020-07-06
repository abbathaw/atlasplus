import db from "../models"

export const getVideo = (videoId) => {
  return db.Video.findByPk(videoId)
}

export const saveNewVideo = async (
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

export const getFileExtension = (fileType) => {
  if (fileType === "video/quicktime") {
    return ".mov"
  } else if (fileType === "video/mp4") {
    return ".mp4"
  } else {
    return ""
  }
}
