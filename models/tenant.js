"use strict"

module.exports = (sequelize, DataTypes) => {
  const Tenant = sequelize.define("Tenant", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    baseUrl: DataTypes.STRING,
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lrsEndpoint: DataTypes.STRING,
    lrsAuth: DataTypes.STRING,
  })

  Tenant.associate = (models) => {
    models.Tenant.hasMany(models.Video, {
      foreignKey: "tenantId",
      as: "videos",
      onDelete: "CASCADE",
    })
  }

  return Tenant
}
