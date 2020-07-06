import db from "../models"
import { parseJwtInHeader } from "./jwt"

export const tenantValidator = function (req, res, next) {
  const identity = parseJwtInHeader(req)
  const tenantId = identity.iss

  //first find if this Tenant exists in our db
  //If found just go next,
  // if not found fetch details from addonsettings table and save data

  console.log("Tenant", db)

  db.Tenant.findByPk(tenantId)
    .then((existingTenant) => {
      if (existingTenant) {
        console.log("Found Tenant", existingTenant)
        next()
      } else {
        db.addon.get("clientInfo", tenantId).then((tenantInAddon) => {
          if (tenantInAddon) {
            console.log(
              "fetched Tenant from addon Settings table",
              tenantInAddon
            )

            const baseUrl = tenantInAddon.baseUrl

            db.Tenant.create({ id: tenantId, baseUrl })
              .then((created) => {
                console.log("created a new tenant with tenantI", created)
                next()
              })
              .catch((error) => {
                console.log("error creating new Tenant", error)
                res.status(404).send(error)
              })
          } else {
            console.log("No tenant found in addon settings", tenantInAddon)
            res.status(401).send("No tenant found")
          }
        })
      }
    })
    .catch((e) => {
      console.error("couldn't find tenant got error", e)
      res.status(404).send(e)
    })
}
