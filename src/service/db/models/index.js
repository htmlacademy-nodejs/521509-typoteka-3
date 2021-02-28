'use strict';

/**
 * Подключаем все модули, и настраиваем связи
 */
const defineCategory = require(`./category`);
const defineArticle = require(`./article`);
const defineComment = require(`./comment`);
const defineArticleCategory = require(`./article-category`);
const defineUser = require(`./user`);
const Alias = require(`./aliase`);

module.exports = (db) => {
  /**
   * Создаем все необходимые модели
   */
  const Category = defineCategory(db);
  const Article = defineArticle(db);
  const Comment = defineComment(db);
  const ArticleCategory = defineArticleCategory(db);
  const User = defineUser(db);

  /**
   * Настраиваем связи
   */

  /**
   * Связь статья - комментарий
   * один ко многим, у статьи много комментариев, а комментарий к одной только статье.
   */
  Article.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `article_id`});
  Comment.belongsTo(Article, {as: Alias.ARTICLES, foreignKey: `article_id`});


  /**
   * Связь "категории - статьи".
   * Многие ко многим, так как у одной категории может быть много статей, а у одной статьи много категорий.
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

  /**
   * Связь пользователь - статья
   * один ко многим, у пользователя много статей, а статья к одному только пользователю.
   */
  User.hasMany(Comment, {as: Alias.ARTICLES, foreignKey: `user_id`});
  Article.belongsTo(Article, {as: Alias.USERS, foreignKey: `user_id`});

  /**
   * Связь пользователь - комментарий
   * один ко многим, у пользователя много комментариев, а комментарий к одному только пользователю.
   */
  User.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `user_id`});
  Comment.belongsTo(Article, {as: Alias.USERS, foreignKey: `user_id`});


  return {
    Category,
    Article,
    Comment,
    User
  };
};
