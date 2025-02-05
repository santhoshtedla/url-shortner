'use strict';
module.exports = (sequelize, DataTypes) => {
  const Url = sequelize.define(
    'Url',
    {
      long_url: DataTypes.STRING,
      short_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      alias: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      topic: DataTypes.STRING,
      created_by: DataTypes.INTEGER
    }, {
    tableName: 'urls',
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

  },
  );
  Url.associate = function (models) {
    // write assosiations here if needed
  };
  return Url;
};
