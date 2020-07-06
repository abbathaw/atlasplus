import { getThumbnails } from "../services/aws"

const express = require("express")
import db from "../models"
import {
  saveVideo,
  getUploadPresignedUrl,
  getSpaceVideos,
  getVideoThumbnails,
} from "../controllers/studioController"
const studioRouter = express.Router()

studioRouter.get("/", function (req, res) {
  const spaceKey = req.query["spaceKey"]
  res.render("studio/video-studio", {
    spaceKey: spaceKey,
  })
})

studioRouter.get("/customCheck", function (req, res) {
  console.log("request", req)
  db.addon._get({ id: 1 }).then(function (favs) {
    console.log("Check DB ccccc", favs)
    res.json({ answer: favs })
  })
})

studioRouter.post("/getPresignedUploadUrl", getUploadPresignedUrl)

studioRouter.post("/saveVideo", saveVideo)

studioRouter.get("/spaceVideos", getSpaceVideos)

studioRouter.get("/videoThumbnails", getVideoThumbnails)

export default studioRouter
