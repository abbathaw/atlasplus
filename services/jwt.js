const atlJwt = require("atlassian-jwt")
import db from "../models"

const AUTH_HEADER = "authorization"
const JWT_PARAM = "jwt"
export const parseJwtInHeader = (req) => {
  const authHeader = req.headers[AUTH_HEADER]
  if (authHeader && authHeader.indexOf("JWT ") === 0) {
    const token = authHeader.substring(4)
    return atlJwt.decode(token, null, true)
  } else {
    const tokenInQuery = req.query[JWT_PARAM]
    if (tokenInQuery) {
      console.log("jwt found in query")
      return atlJwt.decode(tokenInQuery, null, true)
    } else {
      console.warn("No Token found in query or header")
      return null
    }
  }
}

export const isValidToken = async (token) => {
  const decodedToken = await atlJwt.decode(token, null, true)
  const tenantId = decodedToken.iss
  console.log("got tenant from socket", tenantId)
  return await db.addon.get("clientInfo", tenantId).then((tenantInAddon) => {
    if (tenantInAddon) {
      const sharedSecret = tenantInAddon.sharedSecret
      try {
        const verifiedClaims = atlJwt.decode(token, sharedSecret, false)
        return true
      } catch (error) {
        console.log("Unable to decode JWT token: " + error)
        return false
      }
    }
  })
}

export const decodeToken = (token) => {
  return atlJwt.decode(token, null, true)
}
