"use strict"

module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define("Video", {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    ownerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: DataTypes.STRING,
    size_in_mb: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    spaceKey: DataTypes.STRING,
    drm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  })

  Video.associate = (models) => {
    models.Video.belongsTo(models.Tenant, {
      foreignKey: "tenantId",
      as: "video",
    })
    models.Video.hasOne(models.Job, {
      foreignKey: "videoId",
      onDelete: "CASCADE",
    })
  }

  return Video
}
