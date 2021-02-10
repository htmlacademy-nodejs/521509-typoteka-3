'use strict';

/**
 * Роутер для статей. ('/articles')
 */

const {Router} = require(`express`);

const offersRoutes = new Router();

/**
 * Обработка маршрута для добавления статьи - открывается пустая форма для редактирования
 */
offersRoutes.get(`/add`, (req, res) => res.render(`pages/articles/edit-article`));


/**
 * Обработка маршрута для статьи
 */
offersRoutes.get(`/:id`, (req, res) => res.render(`pages/articles/article`));


/**
 * Обработка маршрута для редактирования статьи
 */
offersRoutes.get(`/edit/:id`, (req, res) => res.send(`pages/articles/edit-article`));


/**
 * Обработка маршрута для категории
 */
offersRoutes.get(`/category/:id`, (req, res) => res.render(`pages/articles/articles-by-category`));


module.exports = offersRoutes;
