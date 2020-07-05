const atlJwt = require("atlassian-jwt")

const AUTH_HEADER = "authorization"
const JWT_PARAM = "jwt"
export const parseJwtInHeader = (req) => {
  const authHeader = req.headers[AUTH_HEADER]
  if (authHeader && authHeader.indexOf("JWT ") === 0) {
    console.log("jwt found in header")
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
