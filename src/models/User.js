'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      google_id: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      profile_picture: DataTypes.STRING,
    },
    {
      tableName: 'users',
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  User.associate = function (models) {
    // write assosiations here if needed
  };
  return User;
};
