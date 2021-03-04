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

const {checkAndReturnPositiveNumber} = require(`../../utils`);

const myRoutes = new Router();

/**
 * Обработка маршрута для админской страницы с статьями
 */
myRoutes.get(`/`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware
    ],
    async (req, res, next) => {
      try {
        /**
         * Пытаемся понять, была ли передана страница, если нет, то возвращаем первую страницу по умолчанию
         */
        const page = checkAndReturnPositiveNumber(req.query.page, 1);

        const {articles, totalPages} = await api.getArticlesForAuthor({page}, res.locals.accessToken);

        res.render(`pages/my/articles`, {articles, page, prefix: req.baseUrl, totalPages, currentUser: res.locals.user});
      } catch (e) {
        next(e);
      }
    });


/**
 * Обработка маршрута для админской страницы с комментариями
 */
myRoutes.get(`/comments`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware
    ],
    async (req, res, next) => {
      try {
        const comments = await api.getAllComments(res.locals.accessToken);

        res.render(`pages/my/comments`, {comments, currentUser: res.locals.user, errors: []});
      } catch (e) {
        next(e);
      }
    });

/**
 * Обработка маршрута для админской страницы с комментариями
 */
myRoutes.post(`/articles/:articleId/comments/:commentId/delete`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware
    ],
    async (req, res) => {
      try {
        await api.deleteComment(req.params.articleId, req.params.commentId, res.locals.accessToken);
        res.redirect(`/my/comments`);
      } catch (e) {
        const comments = await api.getAllComments(res.locals.accessToken);
        const errors = e.response ? e.response.data.error.details : [`Внутренняя ошибка сервера, выполните запрос позже./Internal Server Error`];
        res.render(`pages/my/comments`, {comments, currentUser: res.locals.user, errors});
      }
    });


/**
 * Обработка маршрута для админской страницы с категориями
 */
myRoutes.get(`/categories`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware
    ],
    async (req, res, next) => {
      try {
        const categories = await api.getCategories();
        res.render(`pages/my/categories`, {categories, currentUser: res.locals.user, errors: []});
      } catch (e) {
        next(e);
      }
    });

/**
 * Обработка маршрута для админской страницы с категориями
 */
myRoutes.post(`/categories`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware
    ],
    async (req, res) => {
      const categoryData = req.body;
      try {
        await api.addCategory(categoryData, res.locals.accessToken);
        res.redirect(`/my/categories`);
      } catch (e) {
        const categories = await api.getCategories();
        const errors = e.response ? e.response.data.error.details : [`Внутренняя ошибка сервера, выполните запрос позже./Internal Server Error`];
        res.render(`pages/my/categories`, {
          categories,
          newCategory: categoryData ? categoryData.title : ``,
          currentUser: res.locals.user,
          errors
        });
      }
    });

/**
 * Обработка маршрута для админской страницы с категориями
 */
myRoutes.post(`/categories/:id/update`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware
    ],
    async (req, res) => {
      const id = req.params.id;
      const categoryData = req.body;
      try {
        await api.updateCategory(id, categoryData, res.locals.accessToken);
        res.redirect(`/my/categories`);
      } catch (e) {
        const categories = await api.getCategories();
        const errors = e.response ? e.response.data.error.details : [`Внутренняя ошибка сервера, выполните запрос позже./Internal Server Error`];
        res.render(`pages/my/categories`, {
          categories,
          currentUser: res.locals.user,
          errors
        });
      }
    });

/**
 * Обработка маршрута для админской страницы с категориями
 */
myRoutes.post(`/categories/:id/delete`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware
    ],
    async (req, res) => {
      const id = req.params.id;
      try {
        await api.deleteCategory(id, res.locals.accessToken);
        res.redirect(`/my/categories`);
      } catch (e) {
        const categories = await api.getCategories();
        const errors = e.response ? e.response.data.error.details : [`Внутренняя ошибка сервера, выполните запрос позже./Internal Server Error`];
        res.render(`pages/my/categories`, {
          categories,
          currentUser: res.locals.user,
          errors
        });
      }
    });


module.exports = myRoutes;
