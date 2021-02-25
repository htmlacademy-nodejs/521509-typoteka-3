'use strict';

/**
 * Роутер для корневого пути. ('/')
 */

const {Router} = require(`express`);

const api = require(`../api`).getDefaultAPI();

const mainRoutes = new Router();

const {checkAndReturnPositiveNumber} = require(`../../utils`);


/**
 * Обработка маршрута для главной страницы
 */
mainRoutes.get(`/`, async (req, res) => {
  /**
   * Пытаемся понять, была ли передана страница, если нет, то возвращаем первую страницу по умолчанию
   */
  const page = checkAndReturnPositiveNumber(req.query.page, 1);

  const [{totalPages, articles}, categories] = await Promise.all([api.getArticles({page, isWithComments: true}), api.getCategories({isWithCount: true})]);
  res.render(`pages/main`, {articles, page, totalPages, prefix: req.path, categories});
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
