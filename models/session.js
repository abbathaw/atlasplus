"use strict"

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define("Session", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    timeRange: DataTypes.ARRAY(DataTypes.INTEGER),
    startTime: {
      type: DataTypes.DATE,
    },
    endTime: {
      type: DataTypes.DATE,
    },
    sessionDuration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  })

  Session.associate = (models) => {
    models.Session.belongsTo(models.Enrollment, {
      foreignKey: "enrollmentId",
      as: "session",
    })
  }

  return Session
}
