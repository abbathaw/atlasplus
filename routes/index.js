import * as macroController from "../controllers/macroController"
import studioRouter from "./studioRouter"

export default function routes(app, addon) {
  // Redirect root path to /atlassian-connect.json,
  // which will be served by atlassian-connect-express.
  app.get("/", (req, res) => {
    res.redirect("/atlassian-connect.json")
  })

  app.get("/get-started", addon.authenticate(), function (req, res) {
    res.render("admin/get-started", {})
  })

  app.get("/configuration", addon.authenticate(), function (req, res) {
    res.render("admin/configuration", {})
  })

  app.get("/video-macro", addon.authenticate(), macroController.videoMacro)

  app.use(
    "/video-studio",
    // addon.authenticate(), //TODO: enable before deploying
    studioRouter
  )
}
