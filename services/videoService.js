import db from "../models"

export const saveNewVideo = async (
  tenantId,
  userId,
  spaceId,
  fileId,
  videoId,
  name,
  size
) => {
  return await db.Video.create({
    id: videoId,
    tenantId,
    ownerId: userId,
    fileId,
    name,
    sizeInMb: size,
    status: "uploaded",
    spaceId,
  }).then((created) => {
    console.log("created a new tenant with tenantI", created)
  })
}
