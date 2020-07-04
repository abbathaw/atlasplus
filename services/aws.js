const AWS = require("aws-sdk")
export const UPLOAD_PREFIX = "source"

export const getUploadUrl = async (accountId, videoId, file) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  })

  const bucket = process.env.S3_BUCKET_NAME
  const s3 = new AWS.S3({ signatureVersion: "v4", params: { Bucket: bucket } })
  const Key = `${UPLOAD_PREFIX}/${accountId}/${videoId}/${file.fileName}${file.extension}`
  console.log("Bucket", bucket)
  console.log("BUCKETTT", process.env.S3_BUCKET_NAME)
  console.log("Key", Key)
  const params = {
    Bucket: bucket,
    Key,
    Expires: 30 * 60,
    ContentType: file.fileType,
  }
  return await s3.getSignedUrlPromise("putObject", params)
}
