import * as macroController from "../controllers/macroController"
import studioRouter from "./studioRouter"
import { tenantValidator } from "../services/tenantChecker"
import { processSns } from "../controllers/snsController"
import * as playerController from "../controllers/playerController"
const bodyParser = require("body-parser")

export default function routes(app, addon) {
  // Redirect root path to /atlassian-connect.json,
  // which will be served by atlassian-connect-express.
  app.get("/", (req, res) => {
    res.redirect("/atlassian-connect.json")
  })

  app.get("/get-started", addon.authenticate(), function (req, res) {
    res.render("admin/get-started")
  })

  app.get("/configuration", addon.authenticate(), function (req, res) {
    res.render("admin/configuration")
  })

  app.get(
    "/video-macro",
    addon.authenticate(),
    tenantValidator,
    macroController.videoMacro
  )

  app.get("/editor", addon.authenticate(), macroController.videoMacroEditor)

  app.post("/video-player-play", playerController.getPlayUrl)

  app.use("/video-studio", addon.authenticate(), tenantValidator, studioRouter)

  app.post("/snsTopic", bodyParser.text(), processSns)
}
