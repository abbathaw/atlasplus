import db from "../models"
import { updateEnrollment } from "./enrollmentService"

export const createSession = async (id, enrollmentId) => {
  const startTime = new Date()
  return await db.Session.create({
    id,
    enrollmentId,
    startTime,
  })
    .then((session) => {
      console.log(`New Session ${id} created & saved to db`)
      return session
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
      console.log(
        ` Session ${sessionId} updated & saved to db.  Rows affected ${rows}.`
      )
    })
    .catch((e) => {
      console.error("Error updated Session created to db", e)
    })
}

export const endSession = async (sessionId, lastCurrentTimeProps) => {
  db.Session.findByPk(sessionId).then((session) => {
    const sessionEndtime = new Date()
    const sessionStartTime = session.startTime ? session.startTime : new Date()
    const sessionDiff = sessionEndtime - sessionStartTime
    const sessionDuration = Math.round(sessionDiff / 1000)

    db.Session.update(
      { sessionDuration, endTime: sessionEndtime },
      { where: { id: sessionId } }
    )
      .then((rows) => {
        console.log(
          ` ENDING session..Session ${sessionId} updated & saved to db.  Rows affected ${rows}.`
        )
      })
      .catch((e) => {
        console.error("Error updated Session created to db", e)
      })

    //getEnrollment and update it
    db.Enrollment.findByPk(session.enrollmentId)
      .then(async (enrollment) => {
        const totalTimeSpent = sessionDuration + enrollment.timeSpent

        const sessionTimeRange = session.timeRange ? session.timeRange : []
        const enrollmentTimeRange = enrollment.timeRange
          ? enrollment.timeRange
          : []
        const updatedTimeRange = loopOnSession(
          sessionTimeRange,
          enrollmentTimeRange
        )

        const watched = calculateWatched(updatedTimeRange)
        const lastCurrentTime = lastCurrentTimeProps
          ? Math.floor(lastCurrentTimeProps)
          : 0

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
      if (initial !== undefined && second !== undefined) {
        arrayClone = target(initial, second, arrayClone)
      }
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
