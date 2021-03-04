'use strict';

/**
 * Роутер для корневого пути. ('/')
 */

const {Router} = require(`express`);

const api = require(`../api`).getDefaultAPI();

const mainRoutes = new Router();

const Uploader = require(`../lib/uploader`);
const checkUserAuthMiddleware = require(`../middlewares/check-user-auth`);


const {checkAndReturnPositiveNumber} = require(`../../utils`);

const uploaderMiddleware = new Uploader(`img`).getMiddleware();


/**
 * Обработка маршрута для главной страницы
 */
mainRoutes.get(`/`, checkUserAuthMiddleware, async (req, res, next) => {
  try {
    /**
     * Пытаемся понять, была ли передана страница, если нет, то возвращаем первую страницу по умолчанию
     */
    const page = checkAndReturnPositiveNumber(req.query.page, 1);

    const [{totalPages, articles}, categories, mostDiscussedArticles] = await Promise.all([api.getArticles({
      page,
      isWithComments: true
    }), api.getCategories({isWithCount: true}), api.getMostDiscussedArticles()]);
    res.render(`pages/main`, {articles, page, totalPages, prefix: req.path, categories, mostDiscussedArticles, currentUser: res.locals.user});
  } catch (e) {
    next(e);
  }
});


/**
 * Обработка маршрута для страницы с регистрацией
 */
mainRoutes.get(`/register`, checkUserAuthMiddleware, (req, res) => res.render(`pages/register`, {user: {}, errors: {}, currentUser: res.locals.user}));

mainRoutes.post(`/register`, [uploaderMiddleware.single(`avatar`), checkUserAuthMiddleware], async (req, res) => {
  const {body, file} = req;

  let userData = {};

  try {
    userData = {
      firstName: body[`first_name`],
      lastName: body[`last_name`],
      email: body.email,
      password: body.password,
      repeatPassword: body[`password-repeat`],
      avatar: file ? file.filename : null
    };

    await api.addUser(userData);
    res.redirect(`/login`);
  } catch (e) {
    const errors = e.response ? e.response.data.error.details : [`Внутренняя ошибка сервера, выполните запрос позже./Internal Server Error`];
    res.render(`pages/register`, {user: userData, errors, currentUser: res.locals.user});
  }
});


/**
 * Обработка маршрута для страницы с входом
 */
mainRoutes.get(`/login`, checkUserAuthMiddleware, (req, res) => res.render(`pages/login`, {errors: {}, user: {}, currentUser: res.locals.user}));

mainRoutes.post(`/login`, [uploaderMiddleware.none(), checkUserAuthMiddleware], async (req, res) => {
  const userData = req.body;

  try {
    const tokens = await api.authUser(userData);
    res.cookie(`tokens`, JSON.stringify(tokens), {httpOnly: true});
    res.redirect(`/`);
  } catch (e) {
    const errors = e.response ? e.response.data.error.details : [`Внутренняя ошибка сервера, выполните запрос позже./Internal Server Error`];
    res.render(`pages/login`, {user: userData, errors, currentUser: res.locals.user});
  }
});

/**
 * Обработка маршрута для страницы для выхода
 */
mainRoutes.get(`/logout`, checkUserAuthMiddleware, (req, res) => {
  res.cookie(`tokens`, ``, {httpOnly: true});
  res.redirect(`/`);
});

/**
 * Обработка маршрута для страницы поиска
 */
mainRoutes.get(`/search`, checkUserAuthMiddleware, async (req, res) => {
  const searchText = req.query.query || ``;
  let results = [];
  if (searchText) {
    try {
      results = await api.search(searchText);
    } catch (err) {
      req.log.error(err.message);
    }
  }
  res.render(`pages/search`, {searchText, results, currentUser: res.locals.user});
});


module.exports = mainRoutes;
