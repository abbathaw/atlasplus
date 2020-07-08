import db from "../models"

export const getEnrollmentWithSessions = (videoId, userId) => {
  return db.Enrollment.findAll({
    where: {
      videoId: videoId,
      userId: userId,
    },
    include: [{ model: db.Session, as: "sessions" }],
  })
}

export const getEnrollmentByUserId = async (videoId, userId) => {
  return db.Enrollment.findAll({
    where: {
      videoId: videoId,
      userId: userId,
    },
  })
}

export const getEnrollmentsByVideoId = (videoId) => {
  return db.Enrollment.findAll({
    where: {
      videoId: videoId,
    },
  })
}

export const updateEnrollment = (
  enrollmentId,
  timeSpent,
  watched,
  newTimeRange,
  lastCurrentTime
) => {
  const isCompleted = watched >= "0.90"

  db.Enrollment.update(
    {
      watched,
      timeRange: newTimeRange,
      timeSpent,
      isCompleted,
      lastCurrentTime,
    },
    { where: { id: enrollmentId } }
  )
    .then((rows) => {
      console.log(`Enrollment updated & saved to db. Rows affected ${rows}.`)
    })
    .catch((e) => {
      console.error("Error updating Enrollment created to db", e)
    })
}

export const createEnrollment = async (id, videoId, userId, timeRange) => {
  return await db.Enrollment.create({
    id,
    timeRange,
    videoId,
    userId,
  })
    .then(() => {
      console.log("New Enrollment created & saved to db")
    })
    .catch((e) => {
      console.error("Error saving Enrollment created to db")
    })
}
