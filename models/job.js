"use strict"

module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define("Job", {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    reference: DataTypes.STRING,
    status: DataTypes.STRING,
  })

  Job.associate = (models) => {
    models.Job.belongsTo(models.Video, { foreignKey: "videoId", as: "video" })
  }

  return Job
}
