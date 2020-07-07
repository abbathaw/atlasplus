// Entry point for the app

// Express is the underlying that atlassian-connect-express uses:
// https://expressjs.com
import express from "express"

// https://expressjs.com/en/guide/using-middleware.html
import bodyParser from "body-parser"
import compression from "compression"
import cookieParser from "cookie-parser"
import errorHandler from "errorhandler"
import morgan from "morgan"
import db from "./models"
const socketIo = require("socket.io")
// atlassian-connect-express also provides a middleware
import ace from "atlassian-connect-express"

// Use Handlebars as view engine:
// https://npmjs.org/package/express-hbs
// http://handlebarsjs.com
import hbs from "express-hbs"

// We also need a few stock Node modules
import http from "http"
import path from "path"
import os from "os"
import helmet from "helmet"
import nocache from "nocache"
import favicon from "serve-favicon"

// Routes live here; this is the C in MVC
import routes from "./routes"
require("dotenv").config()
// Bootstrap Express and atlassian-connect-express
const app = express()
const addon = ace(app)

// See config.json
const port = addon.config.port()
app.set("port", port)

// Configure Handlebars
const viewsDir = __dirname + "/views"
app.engine("hbs", hbs.express4({ partialsDir: viewsDir }))
app.set("view engine", "hbs")
app.set("views", viewsDir)

// Log requests, using an appropriate formatter by env
const devEnv = app.get("env") == "development"
app.use(morgan(devEnv ? "dev" : "combined"))

// Atlassian security policy requirements
// http://go.atlassian.com/security-requirements-for-cloud-apps
// HSTS must be enabled with a minimum age of at least one year
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: false,
  })
)
app.use(
  helmet.referrerPolicy({
    policy: ["origin"],
  })
)

// Include request parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Gzip responses when appropriate
app.use(compression())

// Include atlassian-connect-express middleware
app.use(addon.middleware())

// Mount the static files directory
const staticDir = path.join(__dirname, "public")
app.use(express.static(staticDir))

// Atlassian security policy requirements
// http://go.atlassian.com/security-requirements-for-cloud-apps
app.use(nocache())

//favicon
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")))

// Show nicer errors in dev mode
if (devEnv) app.use(errorHandler())

// Wire up routes
routes(app, addon)

//provide a way for our DB object to access to the AddonSettings Model
db.addon = addon.settings
//Now you can use the queries like this db.addon.getAllClientInfos() or db.addon._get({id: 2})

// Boot the HTTP server
const server = http.createServer(app)

// boot the websockets
import socketAnalytics from "./routes/analyticSockets"
socketAnalytics(socketIo(server))

db.sequelize.sync().then(() => {
  server.listen(port, () => {
    console.log("App server running at http://" + os.hostname() + ":" + port)

    // Enables auto registration/de-registration of app into a host in dev mode
    // if ( devEnv ) addon.register();
  })
})
