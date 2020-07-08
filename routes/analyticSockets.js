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
    console.log("socketId", token)
    if (await isValidToken(token)) {
      console.log("socket token is VALID")
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
      console.log("connected video id:", data.videoId)
      socket.videoId = data.videoId

      const enrollments = await getEnrollmentByUserId(
        data.videoId,
        socket.atlUserId
      )
      console.log("getting enrollments", enrollments)
      if (enrollments.length > 0) {
        const enrollment = enrollments[0]
        socket.enrollmentId = enrollment.id
      } else {
        const enrollmentId = uuidv4()
        socket.enrollmentId = enrollmentId
        const initialTimeRange = new Array(Math.round(data.duration) + 1).fill(
          0
        )
        await createEnrollment(
          enrollmentId,
          data.videoId,
          socket.atlUserId,
          initialTimeRange
        )
        console.log("created enrollment from socket")
      }

      //create session
      const sessionId = uuidv4()
      await createSession(sessionId, socket.enrollmentId)
      console.log("created session from socket")
      socket.sessionId = sessionId
    })

    console.log("now I know the user", socket.tenant, socket.atlUserId)

    // handle the event sent with socket.send()
    socket.on("message", (data) => {
      console.log(data)
    })

    socket.on("paused", async (data, currentTime) => {
      console.log("received pause event", data)
      console.log("received pause event with CurrentTime", currentTime)
      await updateSession(socket.sessionId, data)
    })

    socket.on("timeupdate", (data) => {
      socket.videoCurrentTime = data.currentTime
    })

    socket.on("ended", async (data, currentTime) => {
      console.log("received ended event", data)
      await updateSession(socket.sessionId, data)
      if (socket.sessionId) {
        await endSession(socket.sessionId, Math.floor(socket.videoCurrentTime))
      }
    })

    // handle the event sent with socket.emit()
    socket.on("disconnect", async () => {
      console.log("Client disconnected")
      if (socket.sessionId) {
        await endSession(socket.sessionId, Math.floor(socket.videoCurrentTime))
      }
    })
  })
}
