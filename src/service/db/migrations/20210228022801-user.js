'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Создаем таблицу для пользователей
     */
    await queryInterface.createTable(`users`, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING(35),// eslint-disable-line
        allowNull: false,
        field: `first_name`
      },
      lastName: {
        type: Sequelize.STRING(35),// eslint-disable-line
        allowNull: false,
        field: `last_name`
      },
      email: {
        type: Sequelize.STRING(255),// eslint-disable-line
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),// eslint-disable-line
        allowNull: false,
      },
      avatar: {
        type: Sequelize.STRING(255)// eslint-disable-line
      },
      isAuthor: {
        type: Sequelize.BOOLEAN,
        defaultValue: null,
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

    /**
     * Добавляем связь пользователь - статья
     */
    await queryInterface.addColumn(
        `articles`,
        `user_id`,
        {
          type: Sequelize.INTEGER,
          references: {
            model: `users`, // странное название в sequelize, на самом деле тут не модель, а имя таблицы.
            key: `id`,
          },
          onUpdate: `CASCADE`,
          onDelete: `CASCADE`
        }
    );

    /**
     * Добавляем связь пользователь - комментарий
     */
    await queryInterface.addColumn(
        `comments`,
        `user_id`,
        {
          type: Sequelize.INTEGER,
          references: {
            model: `users`, // странное название в sequelize, на самом деле тут не модель, а имя таблицы.
            key: `id`,
          },
          onUpdate: `CASCADE`,
          onDelete: `CASCADE`
        }
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
        `comments`,
        `user_id`
    );

    await queryInterface.removeColumn(
        `articles`,
        `user_id`
    );

    await queryInterface.dropTable(`users`);
  }
};
