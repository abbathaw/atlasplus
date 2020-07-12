import * as macroController from "../controllers/macroController"
import studioRouter from "./studioRouter"
import { tenantValidator } from "../services/tenantChecker"
import { processSns } from "../controllers/snsController"
import * as playerController from "../controllers/playerController"
import * as drmController from "../controllers/drmController"
import { seedEnrollments } from "../services/seed"
const bodyParser = require("body-parser")

export default function routes(app, addon) {
  // Redirect root path to /atlassian-connect.json,
  // which will be served by atlassian-connect-express.
  app.get("/", (req, res) => {
    res.redirect("/atlassian-connect.json")
  })

  app.get("/get-started", function (req, res) {
    res.render("admin/get-started")
  })

  // app.get("/configuration", addon.authenticate(), function (req, res) {
  //   res.render("admin/configuration")
  // })

  app.get(
    "/video-macro",
    addon.authenticate(),
    tenantValidator,
    macroController.videoMacro
  )

  app.get("/editor", addon.authenticate(), macroController.videoMacroEditor)

  app.post(
    "/video-player-play",
    addon.authenticate(),
    playerController.getPlayUrl
  ) //TODO add addon auth here

  app.use("/video-studio", addon.authenticate(), tenantValidator, studioRouter)

  app.post("/snsTopic", bodyParser.text(), processSns)

  app.post("/playToken", addon.authenticate(), drmController.getDRMToken)

  app.get("/external-player", addon.authenticate(), function (req, res) {
    const token = req.query.jwt ? req.query.jwt : "test"
    const videoId = req.query.videoId
    const title = req.query.title
    const isdrm = req.query.isdrm
    res.render("player-external", { token, videoId, title, isdrm })
  })

  //testing purposes only
  app.get("/test-player", function (req, res) {
    res.render("player-test")
  })
  app.post("/video-player-play-test", playerController.getPlayUrlTest)

  app.get("/seed", (req, res) => {
    // seedEnrollments(15, "53aee58c-986f-4f0c-999b-e165b060b2f5", 220).then(r =>
    //     res.send("ok")
    // ).catch(e => {
    //   res.status(500).send("oops")
    // })
    res.send("ok")
  })
}
