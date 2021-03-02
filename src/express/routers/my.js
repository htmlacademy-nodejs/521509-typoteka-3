'use strict';

/**
 * Роутер для личного кабинета. ('/my')
 *
 * @module /src/express/routes/my-routes
 */

const {Router} = require(`express`);

const api = require(`../api`).getDefaultAPI();

const checkUserAuthMiddleware = require(`../middlewares/check-user-auth`);
const checkUserIsAuthorMiddleware = require(`../middlewares/check-author`);

const myRoutes = new Router();

/**
 * Обработка маршрута для админской страницы с статьями
 */
myRoutes.get(`/`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware
    ],
    async (req, res) => {
      const {articles} = await api.getArticles();
      res.render(`pages/my/articles`, {articles, currentUser: res.locals.user});
    });


/**
 * Обработка маршрута для админской страницы с комментариями
 */
myRoutes.get(`/comments`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware
    ],
    async (req, res) => {
      const {articles} = await api.getArticles();

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

      res.render(`pages/my/comments`, {comments, currentUser: res.locals.user});
    });


/**
 * Обработка маршрута для админской страницы с категориями
 */
myRoutes.get(`/categories`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware
    ],
    (req, res) => res.render(`pages/my/categories`, {currentUser: res.locals.user}));


module.exports = myRoutes;
