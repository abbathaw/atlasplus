import db from "../models"

const { v4: uuidv4 } = require("uuid")

export const seedEnrollments = async (number, videoId, lengthVideo) => {
  const results = []

  // const enrollmentId = uuidv4();
  // const fakeUserId = uuidv4();

  await Promise.all(
    Array.from({ length: number }, async (_, i) => {
      const enrollmentId = uuidv4()
      const fakeUserId = uuidv4()

      const timeRange = Array.from({ length: lengthVideo }, (_, i) => {
        return Math.round(Math.random()) //*10) +1
      }).slice(1)

      const watched = calculateWatched(timeRange)

      const isCompleted = watched > 0.9

      const timeSpent = Math.floor(Math.random() * lengthVideo) + 1
      await createEnrollment(
        enrollmentId,
        videoId,
        fakeUserId,
        timeRange,
        isCompleted,
        watched,
        timeSpent
      )
      results.push({
        enrollmentId,
        videoId,
        fakeUserId,
        timeRange,
        isCompleted,
        watched,
        timeSpent,
      })
    })
  )
  console.log("results", results)
}

const calculateWatched = (updatedTimeRange) => {
  const filtered = updatedTimeRange.filter((t) => t > 0)
  return filtered.length / updatedTimeRange.length
}

// cat 94d33bc3-f60b-4b34-b220-06753e074348  13 seconds

//who we are 53aee58c-986f-4f0c-999b-e165b060b2f5  220 seconds

//

export const createEnrollment = async (
  id,
  videoId,
  userId,
  timeRange,
  isCompleted,
  watched,
  timeSpent
) => {
  return await db.Enrollment.create({
    id,
    timeRange,
    videoId,
    userId,
    isCompleted,
    watched,
    timeSpent,
  })
    .then(() => {
      console.log("New Enrollment created & saved to db")
    })
    .catch((e) => {
      console.error("Error saving Enrollment created to db")
    })
}
