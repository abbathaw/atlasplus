import { getJobTemplate } from "./mediaconvert/jobTemplate"
import { getJobTemplateWithDRM } from "./mediaconvert/jobTemplateDrm"
import { getTranscribeJob } from "./transcribe/transcribeJobTemplate"

const AWS = require("aws-sdk")
export const UPLOAD_PREFIX = "source"
export const OUTPUT_PREFIX = "output"

export const getUploadUrl = async (accountId, videoId, file) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  })

  const bucket = process.env.S3_BUCKET_NAME
  const s3 = new AWS.S3({ signatureVersion: "v4", params: { Bucket: bucket } })
  const Key = `${UPLOAD_PREFIX}/${accountId}/${videoId}/${file.fileName}${file.extension}`
  const params = {
    Bucket: bucket,
    Key,
    Expires: 30 * 60,
    ContentType: file.fileType,
  }
  return await s3.getSignedUrlPromise("putObject", params)
}

export const triggerMediaConvertJob = (
  contextPath,
  inputPath,
  isDRM,
  videoId
) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  })

  AWS.config.mediaconvert = { endpoint: process.env.MEDIA_CONVERT_ENDPOINT }

  const bucket = process.env.S3_BUCKET_NAME
  const fullSourcePath = `s3://${bucket}/${UPLOAD_PREFIX}/${contextPath}/${inputPath}`
  const outPutPath = `s3://${bucket}/${OUTPUT_PREFIX}/${contextPath}/`

  const jobParams = isDRM
    ? getJobTemplateWithDRM(fullSourcePath, outPutPath, videoId)
    : getJobTemplate(fullSourcePath, outPutPath)

  // Create a promise on a MediaConvert object
  return new AWS.MediaConvert({ apiVersion: "2017-08-29" })
    .createJob(jobParams)
    .promise()
}

export const getThumbnails = (tenantId, videoId, cb) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  })

  const bucket = process.env.S3_BUCKET_NAME
  const s3 = new AWS.S3({ signatureVersion: "v4", params: { Bucket: bucket } })
  const prefix = `${OUTPUT_PREFIX}/${tenantId}/${videoId}/thumbnails/`

  const listObjectsParams = {
    Bucket: bucket,
    Prefix: prefix,
  }

  // get the required objects keys
  s3.listObjectsV2(listObjectsParams, async (err, data) => {
    if (data.Contents.length === 0) {
      // return falsy value
      cb("")
    } else {
      const keys = data.Contents.map((content) => content.Key)
      const getObjectParams = {
        Bucket: bucket,
        Key: keys[0],
        Expires: 30 * 60,
      }
      // get the signed url for one object key
      // TODO: Refactor with Promise.all() to get all objects (all thumbnails)
      cb(await s3.getSignedUrlPromise("getObject", getObjectParams))
    }
  })
}

export const triggerTranscodeJob = (tenantId, videoId, fileId) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  })

  console.log(`Triggering transcode job for ${tenantId} and videoId ${videoId}`)

  const transcribeService = new AWS.TranscribeService({
    apiVersion: "2017-10-26",
  })

  const bucket = process.env.S3_BUCKET_NAME
  const input = `s3://${bucket}/${OUTPUT_PREFIX}/${tenantId}/${videoId}/audio/${fileId}.mp4`
  const output = process.env.S3_BUCKET_NAME_SUBTITLES

  const jobParams = getTranscribeJob(input, output, videoId)

  return transcribeService.startTranscriptionJob(jobParams, function (
    err,
    data
  ) {
    if (err) console.log("transcription error", err, err.stack)
    // an error occurred
    else console.log("transcription ok", data) // successful response
  })
}
