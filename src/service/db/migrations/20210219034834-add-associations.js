'use strict';

// по мотивам вот этой статьи: https://medium.com/@andrewoons/how-to-define-sequelize-associations-using-migrations-de4333bf75a7
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Добавляем связь комментарий - статья
     */
    await queryInterface.addColumn(
        `comments`,
        `article_id`,
        {
          type: Sequelize.INTEGER,
          references: {
            model: `articles`, // странное название в sequelize, на самом деле тут не модель, а имя таблицы.
            key: `id`,
          },
          onUpdate: `CASCADE`,
          onDelete: `CASCADE`
        }
    );
    /**
     * Добавляем связи комментарии - категории
     *
     */
    await queryInterface.createTable(`articles_categories`, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      articleId: {
        type: Sequelize.INTEGER,// eslint-disable-line
        allowNull: false,
        field: `article_id`,
        references: {
          model: `articles`, // странное название в sequelize, на самом деле тут не модель, а имя таблицы.
          key: `id`,
        },
        onUpdate: `CASCADE`,
        onDelete: `CASCADE`
      },
      categoryId: {
        type: Sequelize.INTEGER,// eslint-disable-line
        allowNull: false,
        field: `category_id`,
        references: {
          model: `categories`, // странное название в sequelize, на самом деле тут не модель, а имя таблицы.
          key: `id`,
        },
        onUpdate: `CASCADE`,
        onDelete: `CASCADE`
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
    await queryInterface.removeColumn(
        `comments`, // name of Source model
        `article_id`
    );
    await queryInterface.dropTable(`articles_categories`);
  }
};
