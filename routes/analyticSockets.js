import { decodeToken } from "../services/jwt"
import {
  createEnrollment,
  getEnrollmentByUserId,
} from "../services/enrollmentService"
import {
  createSession,
  endSession,
  updateSession,
} from "../services/sessionService"
const { v4: uuidv4 } = require("uuid")
const { isValidToken } = require("../services/jwt")

export default function (io) {
  const analyticsIo = io.of("/analytics")

  analyticsIo.use(async function (socket, next) {
    const token = socket.handshake.query.token
    if (await isValidToken(token)) {
      // console.log("socket token is VALID")
      return next()
    } else {
      console.log("socket token is not valid")
    }
    next()
  })

  analyticsIo.on("connection", (socket) => {
    console.log("socketId", socket.id)
    const token = socket.handshake.query.token
    const identity = decodeToken(token)
    socket.tenant = identity.iss
    socket.atlUserId = identity.sub ? identity.sub : ""

    socket.on("storeClientInfo", async (data) => {
      socket.videoId = data.videoId

      const enrollments = await getEnrollmentByUserId(
        data.videoId,
        socket.atlUserId
      )

      if (enrollments.length > 0) {
        const enrollment = enrollments[0]
        socket.enrollmentId = enrollment.id
        const sessionId = uuidv4()
        await createSessionInt(sessionId, socket.enrollmentId)
        socket.sessionId = sessionId
      } else {
        const enrollmentId = uuidv4()

        const initialTimeRange = new Array(Math.round(data.duration)).fill(0)
        await createEnrollment(
          enrollmentId,
          data.videoId,
          socket.atlUserId,
          initialTimeRange
        ).then(async (res) => {
          socket.enrollmentId = enrollmentId
          const sessionId = uuidv4()
          await createSessionInt(sessionId, socket.enrollmentId)
          socket.sessionId = sessionId
          socket.end = false
          socket.timeRange = []
          socket.initialTime = 0
        })
      }
    })

    socket.on("seeked", async (timeRange, currentTime) => {
      socket.initialTime = Math.round(currentTime)
      socket.timeRange = timeRange
      socket.ended = false
    })

    socket.on("paused", async (timeRange, currentTime) => {
      await updateSession(socket.sessionId, timeRange)
      socket.timeRange = timeRange
      socket.ended = true
    })

    socket.on("timeupdate", (currentTime) => {
      socket.videoCurrentTime = currentTime
      socket.ended = false
    })

    socket.on("ended", async (timeRange, currentTime) => {
      await updateSession(socket.sessionId, timeRange)
      socket.timeRange = timeRange
      socket.ended = true
    })

    // handle the event sent with socket.emit()
    socket.on("disconnect", async () => {
      console.log("Client disconnected")
      if (socket.sessionId) {
        const lastCurrentTime = socket.videoCurrentTime
          ? Math.floor(socket.videoCurrentTime)
          : 0
        await endSession(
          socket.sessionId,
          lastCurrentTime,
          socket.timeRange,
          socket.ended,
          socket.initialTime
        )
      }
    })
  })
}

const createSessionInt = async (sessionId, enrollmentId) => {
  return await createSession(sessionId, enrollmentId).then((res) => {
    console.log("created session from socket")
  })
}
