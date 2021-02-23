'use strict';

const Aliases = require(`./models/aliase`);

/**
 * Модуль для заполнения базы тестовыми статьями.
 * База синхронизируется в жестком режиме, то есть все данные будут утеряны.
 *
 * @async
 * @param {sequelize.Sequelize} db - подключенный инстанс sequelize
 * @param {Object[]} articles статьи
 * @param {Object[]} categories категории
 */
module.exports = async (db, {articles, categories}) => {
  await db.truncate({
    cascade: true,
    restartIdentity: true,
    force: true
  });

  await db.models.Category.bulkCreate(categories.map((title) => ({title})));

  const articleCreationPromises = articles.map(async (articleData) => {
    const article = await db.models.Article.create(articleData, {include: [Aliases.COMMENTS]});
    await article.addCategories(articleData.categories);
  });
  await Promise.all(articleCreationPromises);
};
