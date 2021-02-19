'use strict';

const {Model} = require(`sequelize`);

module.exports = (db) => {
  class ArticleCategory extends Model {}
  ArticleCategory.init({},
      {
        sequelize: db,
        modelName: `ArticleCategory`,
        tableName: `articles_categories`,
        timestamps: true,
        paranoid: true,
        createdAt: `created_at`,
        updatedAt: `updated_at`,
        deletedAt: `deleted_at`
      }
  );
  return ArticleCategory;
};
