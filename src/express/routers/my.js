'use strict';

/**
 * Роутер для личного кабинета. ('/my')
 *
 * @module /src/express/routes/my-routes
 */

const {Router} = require(`express`);

const api = require(`../api`).getDefaultAPI();

const myRoutes = new Router();

/**
 * Обработка маршрута для админской страницы с статьями
 */
myRoutes.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`pages/my/articles`, {articles});
});


/**
 * Обработка маршрута для админской страницы с комментариями
 */
myRoutes.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();

  // TEMPORARY отдаются не комментарии по объявлению пользователя, а просто комментарии трех последних статей.
  const comments = [];
  articles.slice(0, 3)
    .forEach((article) => {
      article.comments.forEach((comment) => comments.push({
        articleTitle: article.title,
        articleId: article.id,
        ...comment
      }));
    });

  res.render(`pages/my/comments`, {comments});
});


/**
 * Обработка маршрута для админской страницы с категориями
 */
myRoutes.get(`/categories`, (req, res) => res.render(`pages/my/categories`));

module.exports = myRoutes;
