export const dbConfig = {
  adapter: "sequelize",
  dialect: "postgres",
  url: process.env.POSTGRES_URL,
  username: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  logging: false,
}
