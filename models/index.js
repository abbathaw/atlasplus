import fs from "fs"
import path from "path"
import { Sequelize } from "sequelize"
// const env = process.env.NODE_ENV || "development"
const config = require("../db.js")
const basename = path.basename(__filename)
let db = {}

console.log("I have config details", config)
const sequelize = new Sequelize(config.dbConfig.url, config.dbConfig)

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    )
  })
  .forEach((file) => {
    const model = sequelize["import"](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
