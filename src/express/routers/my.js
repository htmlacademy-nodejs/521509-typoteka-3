'use strict';

/**
 * Роутер для личного кабинета. ('/my')
 *
 * @module /src/express/routes/my-routes
 */

const {Router} = require(`express`);

const myRoutes = new Router();

/**
 * Обработка маршрута для админской страницы с статьями
 */
myRoutes.get(`/`, (req, res) => res.render(`pages/my/articles`));


/**
 * Обработка маршрута для админской страницы с комментариями
 */
myRoutes.get(`/comments`, (req, res) => res.render(`pages/my/comments`));


/**
 * Обработка маршрута для админской страницы с категориями
 */
myRoutes.get(`/categories`, (req, res) => res.render(`pages/my/categories`));

module.exports = myRoutes;
