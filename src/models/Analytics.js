'use strict';
module.exports = (sequelize, DataTypes) => {
  const Analytics = sequelize.define(
    'Analytics',
    {
      url_id: DataTypes.INTEGER,
      user_agent: DataTypes.STRING,
      ip_address: DataTypes.STRING,
      geolocation: DataTypes.JSONB,
      device_type: DataTypes.STRING,
      os_type: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      timestamp: DataTypes.DATE,
    }, {
    tableName: 'analytics',
    timestamps: false,
  },
  );
  Analytics.associate = function (models) {
    Analytics.belongsTo(models.Url, { foreignKey: "url_id" ,as: "shortUrl" });
  };
  return Analytics;
};
