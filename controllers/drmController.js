const crypto = require("crypto")

export const getDRMToken = (req, res) => {
  try {
    const videoId = "ca0da826-23fc-46d6-bf31-1af5c0006d58"
    const userId = "557058:fa9be00d-75e6-4124-9e99-75610bdee922"
    // step 1 input setting values
    const AES_IV = "0123456789abcdef"
    const siteInfo = {
      siteId: process.env.PALLYCON_SITE_ID,
      siteKey: process.env.PALLYCON_SITE_KEY,
      accessKey: process.env.PALLYCON_SITE_ACCESS_KEY,
    }

    let licenseInfo = {
      drmType: "Widevine",
      contentId: videoId,
      userId: userId.substring(0, 32),
    }

    let licenseRule = {
      playback_policy: {
        limit: true,
        persistent: false,
        duration: 3600,
      },
    }

    console.log("license rule : " + JSON.stringify(licenseRule))

    // step 2 encrypt license rule
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      siteInfo.siteKey,
      AES_IV
    )
    let encryptedRule = cipher.update(
      JSON.stringify(licenseRule),
      "utf-8",
      "base64"
    )
    encryptedRule += cipher.final("base64")

    console.log("encrypted rule : " + encryptedRule)

    // step 3 create hash value
    const UTCTime = new Date().toISOString()

    let hashData = {
      siteId: siteInfo.siteId,
      accessKey: siteInfo.accessKey,
      drmType: licenseInfo.drmType,
      userId: licenseInfo.userId,
      cid: licenseInfo.contentId,
      token: encryptedRule,
      timestamp: UTCTime,
    }

    const hashInput =
      hashData.accessKey +
      hashData.drmType +
      hashData.siteId +
      hashData.userId +
      hashData.cid +
      hashData.token +
      hashData.timestamp

    console.log("hash input : " + hashInput)

    let hashString = crypto
      .createHash("sha256")
      .update(hashInput)
      .digest("base64")

    //step 4 create license token
    let tokenData = {
      drm_type: licenseInfo.drmType,
      site_id: siteInfo.siteId,
      user_id: licenseInfo.userId,
      cid: licenseInfo.contentId,
      token: encryptedRule,
      timestamp: UTCTime,
      hash: hashString,
    }

    console.log("token json : " + JSON.stringify(tokenData))

    let base64Token = Buffer.from(JSON.stringify(tokenData)).toString("base64")

    console.log("base64 encoded token : " + base64Token)

    res.json({ token: base64Token })
  } catch (e) {
    console.error("Getting license token failed", e)
    res.status(400).send("An error occured getting the license token")
  }
}
