'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(`comments`, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING(1000),// eslint-disable-line
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn(`now`),
        field: `created_at`
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn(`now`),
        field: `updated_at`
      },
      deletedAt: {
        defaultValue: null,
        type: Sequelize.DATE,
        field: `deleted_at`
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable(`comments`);
  }
};
