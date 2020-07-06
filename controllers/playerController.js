import { parseJwtInHeader } from "../services/jwt"
import { getVideo } from "../services/videoService"

export const getPlayUrl = async (req, res) => {
  const identity = await parseJwtInHeader(req)
  const tenantId = identity.iss

  const videoId = req.body.videoId

  await getVideo(videoId).then((video) => {
    if (video) {
      if (video.tenantId !== tenantId) {
        res.status(401).send("Auth token mismatch for organization")
      }

      const s3BucketUrl = `https://${process.env.S3_BUCKET_NAME}.s3-${process.env.AWS_REGION}.amazonaws.com`
      const playUrl = `${s3BucketUrl}/output/${tenantId}/${videoId}/${video.fileId}.mpd`

      res.json({ url: playUrl })
    } else {
      res.status(404).send("Video not found")
    }
  })
  res.status(200)
}

export const getPlayUrlTest = async (req, res) => {
  const videoId = req.body.videoId

  await getVideo(videoId).then((video) => {
    if (video) {
      const s3BucketUrl = `https://${process.env.S3_BUCKET_NAME}.s3-${process.env.AWS_REGION}.amazonaws.com`
      const playUrl = `${s3BucketUrl}/output/${video.tenantId}/${videoId}/${video.fileId}.mpd`

      res.json({ url: playUrl })
    } else {
      res.status(404).send("Video not found")
    }
  })
  res.status(200)
}
