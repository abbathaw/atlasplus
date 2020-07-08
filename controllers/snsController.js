import { getJob, updateJob } from "../services/jobService"

const request = require("request")

//really ugly code from stackoverflow to handle sns topics
export const processSns = async (req, res) => {
  try {
    let payloadStr = req.body
    const payload = JSON.parse(payloadStr)
    // console.log(JSON.stringify(payload))
    if (req.header("x-amz-sns-message-type") === "SubscriptionConfirmation") {
      const url = payload.SubscribeURL
      await request(url, handleSubscriptionResponse)
    } else if (req.header("x-amz-sns-message-type") === "Notification") {
      //process data here
      await processSnsPayload(payload)
      res.status(200).send("Ok")
    } else {
      throw new Error(`Invalid message type ${payload.Type}`)
    }
  } catch (err) {
    console.error(err)
    res.status(500).send("Oops")
  }
}

const processSnsPayload = async (payload) => {
  const isVerified = verifySNSTopic(payload)
  if (isVerified) {
    const message = JSON.parse(payload.Message)
    const { jobId: jobReference, status, outputGroupDetails } = message.detail
    console.log("SNS Message detail", message.detail)
    const output = outputGroupDetails.filter(
      (output) => output.type === "DASH_ISO_GROUP"
    )
    let outputTargetDuration = 0
    try {
      const duration = output[0].outputDetails[0].durationInMs
      outputTargetDuration = Math.floor(duration)
    } catch (e) {
      console.error("Couldn't grab output duration from SNS", e)
    }

    const job = await getJob(jobReference)
    if (job.length > 0 && job[0]) {
      await updateJob(job[0].id, status, outputTargetDuration)
    }
  }
}

const verifySNSTopic = (payload) => {
  return payload.TopicArn === process.env.SNS_TOPIC_ARN
}

const handleSubscriptionResponse = function (error, response) {
  if (!error && response.statusCode === 200) {
    console.log("Subscription Confirmed")
  } else {
    throw new Error(`Unable to subscribe to given URL`)
    //console.error(error)
  }
}
