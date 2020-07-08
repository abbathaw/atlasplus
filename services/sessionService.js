import db from "../models"
import { updateEnrollment } from "./enrollmentService"

export const createSession = async (id, enrollmentId) => {
  const startTime = new Date()
  return await db.Session.create({
    id,
    enrollmentId,
    startTime,
  })
    .then(() => {
      console.log("New Session created & saved to db")
    })
    .catch((e) => {
      console.error("Error saving Session created to db", e)
    })
}

export const updateSession = async (sessionId, timeRange) => {
  return await db.Session.update(
    {
      timeRange,
    },
    { where: { id: sessionId } }
  )
    .then((rows) => {
      console.log(`New Session updated & saved to db.  Rows affected ${rows}.`)
    })
    .catch((e) => {
      console.error("Error updated Session created to db", e)
    })
}

export const endSession = async (sessionId, lastCurrentTime) => {
  db.Session.findByPk(sessionId).then((session) => {
    const sessionEndtime = new Date()
    const sessionDiff = sessionEndtime - session.startTime
    const sessionDuration = Math.round(sessionDiff / 1000)

    db.Session.update(
      { sessionDuration, endTime: sessionEndtime },
      { where: { id: sessionId } }
    )
      .then((rows) => {
        console.log(
          `New Session updated & saved to db.  Rows affected ${rows}.`
        )
      })
      .catch((e) => {
        console.error("Error updated Session created to db", e)
      })

    //getEnrollment and update it
    db.Enrollment.findByPk(session.enrollmentId)
      .then(async (enrollment) => {
        console.log("sessionEndTime", sessionEndtime)
        console.log("sessionstartTime", session.startTime)
        console.log("sessionDuration", enrollment.timeSpent)

        console.log("lastCurrentTime", lastCurrentTime)

        const totalTimeSpent = sessionDuration + enrollment.timeSpent

        const sessionTimeRange = session.timeRange ? session.timeRange : []
        const updatedTimeRange = loopOnSession(
          sessionTimeRange,
          enrollment.timeRange
        )

        const watched = calculateWatched(updatedTimeRange)

        await updateEnrollment(
          enrollment.id,
          totalTimeSpent,
          watched,
          updatedTimeRange,
          lastCurrentTime
        )
      })
      .catch((e) => {
        console.error("Error ending Session created to db", e)
      })
  })
}

const calculateWatched = (updatedTimeRange) => {
  const filtered = updatedTimeRange.filter((t) => t > 0)
  return filtered.length / updatedTimeRange.length
}

const loopOnSession = (sessionArray, originalArray) => {
  let arrayClone = originalArray
  for (let i = 0; i < sessionArray.length; i++) {
    if (i % 2 === 0) {
      let initial = sessionArray[i]
      let second = sessionArray[i + 1]
      arrayClone = target(initial, second, arrayClone)
    }
  }
  return arrayClone
}

const target = (start, end, originalArray) => {
  let cloneArray = originalArray
  for (let i = start; i < end; i++) {
    cloneArray[i]++
  }
  return cloneArray
}
