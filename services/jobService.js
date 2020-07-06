import db from "../models"
import { triggerMediaConvertJob } from "./aws"
const { Op } = require("sequelize")

export const triggerEncoderJob = async (
  tenantId,
  videoId,
  fileId,
  fileExtension
) => {
  const contextPath = `${tenantId}/${videoId}`
  const sourceFilePath = `${fileId}${fileExtension}`

  triggerMediaConvertJob(contextPath, sourceFilePath).then(
    async function (data) {
      const jobReference = data.Job.Id
      const initialStatus = data.Job.Status
      console.log("Job created! ", data.Job.Id)
      await saveNewJob(videoId, jobReference, initialStatus)
    },
    function (err) {
      console.log("Error", err)
    }
  )
}

export const saveNewJob = async (videoId, jobReference, status) => {
  db.Job.create({
    reference: jobReference,
    videoId,
    status,
  })
    .then(() => {
      console.log("New job created & saved to db", jobReference)
    })
    .catch((e) => {
      console.error("Error saving job created to db")
    })
}

export const getJob = (jobReference) => {
  return db.Job.findAll({
    where: {
      reference: jobReference,
    },
  })
}

export const updateJob = async (jobId, status) => {
  return await db.Job.update({ status }, { where: { id: jobId } }).then(
    (rows) => {
      console.log(
        `Job id ${jobId} Status updated to ${status}. Rows affected ${rows}.`
      )
    }
  )
}
