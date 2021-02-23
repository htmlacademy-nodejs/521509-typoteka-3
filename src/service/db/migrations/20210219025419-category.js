'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(`categories`, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(30),// eslint-disable-line
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: `created_at`,
        defaultValue: Sequelize.fn(`now`)
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: `updated_at`,
        defaultValue: Sequelize.fn(`now`)
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable(`categories`);
  }
};
