import { decodeToken } from "../services/jwt"

const { isValidToken } = require("../services/jwt")

export default function (io) {
  const analyticsIo = io.of("/analytics")

  analyticsIo.use(async function (socket, next) {
    const token = socket.handshake.query.token
    console.log("soccketId", token)
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

    socket.on("storeClientInfo", (data) => {
      console.log("connected custom id:", data.customId)
      socket.customId = data.customId
    })
    // either with send()
    socket.send("jjjkjkj!")

    console.log("now I know the user", socket.tenant, socket.atlUserId)

    // or with emit() and custom event names
    socket.emit("greetings", "Hey!", { ms: "jane" }, Buffer.from([4, 3, 3, 1]))

    // handle the event sent with socket.send()
    socket.on("message", (data) => {
      console.log(data)
    })

    // handle the event sent with socket.emit()
    socket.on("salutations", (elem1, elem2, elem3) => {
      console.log(elem1, elem2, elem3)
    })
    socket.on("disconnect", () => {
      console.log("Client disconnected")
    })
  })
}
