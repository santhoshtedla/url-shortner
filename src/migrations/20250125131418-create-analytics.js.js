'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('analytics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      url_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'urls',
          key: 'id'
        },
      },
      user_agent: {
        type: Sequelize.STRING,
      },
      ip_address: {
        type: Sequelize.STRING,
      },
      geolocation: {
        type: Sequelize.JSONB,
      },
      os_type: {
        type: Sequelize.STRING,
      },
      device_type: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: function (queryInterface) {
    return queryInterface.dropTable('analytics');
  },
};
