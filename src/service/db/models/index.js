'use strict';

/**
 * Подключаем все модули, и настраиваем связи
 */
const defineCategory = require(`./category`);
const defineArticle = require(`./article`);
const defineComment = require(`./comment`);
const defineArticleCategory = require(`./article-category`);
const Alias = require(`./aliase`);

module.exports = (db) => {
  /**
   * Создаем все необходимые модели
   */
  const Category = defineCategory(db);
  const Article = defineArticle(db);
  const Comment = defineComment(db);
  const ArticleCategory = defineArticleCategory(db);

  /**
   * Настраиваем связи
   */

  /**
   * Связь объявление - комментарий
   * один ко многим, у объявления много комментариев, а комментарий к одному только объявлению.
   */
  Article.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `article_id`});
  Comment.belongsTo(Article, {as: Alias.ARTICLES, foreignKey: `article_id`});


  /**
   * Связь "категории - объявления".
   * Многие ко многим, так как у одной категории может быть много объявлений, а у одного объявления много категорий.
   * Используется связь  super-many-to-many https://sequelize.org/master/manual/advanced-many-to-many.html
   */
  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Alias.ARTICLES,
    foreignKey: `category_id`,
    otherKey: `article_id`
  });
  Article.belongsToMany(Category, {
    through: ArticleCategory,
    as: Alias.CATEGORIES,
    foreignKey: `article_id`,
    otherKey: `category_id`
  });
  Category.hasMany(ArticleCategory, {as: Alias.ARTICLES_CATEGORIES, foreignKey: `category_id`});
  Article.hasMany(ArticleCategory, {as: Alias.ARTICLES_CATEGORIES, foreignKey: `article_id`});


  return {
    Category,
    Article,
    Comment,
    // OfferCategory
  };
};
