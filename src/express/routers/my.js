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
      } catch (e) {
        next(e);
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
