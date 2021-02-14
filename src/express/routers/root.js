'use strict';

/**
 * Роутер для корневого пути. ('/')
 */

const {Router} = require(`express`);

const api = require(`../api`).getDefaultAPI();

const mainRoutes = new Router();


/**
 * Обработка маршрута для главной страницы
 */
mainRoutes.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`pages/main`, {articles});
});


/**
 * Обработка маршрута для страницы с регистрацией
 */
mainRoutes.get(`/register`, (req, res) => res.render(`pages/register`));


/**
 * Обработка маршрута для страницы с входом
 */
mainRoutes.get(`/login`, (req, res) => res.render(`pages/login`));


/**
 * Обработка маршрута для страницы поиска
 */
mainRoutes.get(`/search`, async (req, res) => {
  const searchText = req.query.query || ``;
  let results = [];
  if (searchText) {
    try {
      results = await api.search(searchText);
    } catch (err) {
      req.log.error(err.message);
    }
  }
  res.render(`pages/search`, {searchText, results});
});


module.exports = mainRoutes;
