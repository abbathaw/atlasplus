"use strict"

module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define("Enrollment", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    watched: DataTypes.DECIMAL,
    lastCurrentTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    timeRange: DataTypes.ARRAY(DataTypes.INTEGER),
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  })

  Enrollment.associate = (models) => {
    models.Enrollment.belongsTo(models.Video, {
      foreignKey: "videoId",
      as: "enrollment",
    })
    models.Enrollment.hasMany(models.Session, {
      foreignKey: "enrollmentId",
      as: "sessions",
      onDelete: "CASCADE",
    })
  }

  return Enrollment
}
