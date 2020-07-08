"use strict"

module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define("Video", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileId: DataTypes.UUID,
    name: DataTypes.STRING,
    sizeInMb: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    sourceFileType: DataTypes.STRING,
    spaceId: DataTypes.STRING,
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
    models.Video.hasMany(models.Enrollment, {
      foreignKey: "videoId",
      as: "enrollments",
      onDelete: "CASCADE",
    })
  }

  return Video
}
