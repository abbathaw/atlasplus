const express = require("express")
import db from "../models"
const studioRouter = express.Router()

studioRouter.get("/", function (req, res) {
  const spaceKey = req.query["spaceKey"]
  res.render("video-studio", {
    spaceKey: spaceKey,
  })
})

studioRouter.get("/customCheck", function (req, res) {
  console.log("request", req)
  db.addon._get({ id: 2 }).then(function (favs) {
    console.log("Check DB ccccc", favs)
    res.json({ answer: favs })
  })
})

export default studioRouter
