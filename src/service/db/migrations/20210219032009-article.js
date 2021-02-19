'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(`articles`, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(250),// eslint-disable-line
        allowNull: false
      },
      announce: {
        type: Sequelize.STRING(250),// eslint-disable-line
        allowNull: false
      },
      // длина текста согласно ТЗ 1000 символов, и поле является не обязательным(!?)
      text: {
        type: Sequelize.STRING(1000)// eslint-disable-line
      },
      publishedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: `published_at`
      },
      image: {
        type: Sequelize.STRING(255),// eslint-disable-line
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
      },
      deletedAt: {
        defaultValue: null,
        type: Sequelize.DATE,
        field: `deleted_at`
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable(`articles`);
  }
};
