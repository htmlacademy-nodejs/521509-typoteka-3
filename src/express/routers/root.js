'use strict';

/**
 * Роутер для корневого пути. ('/')
 */

const {Router} = require(`express`);

const mainRoutes = new Router();


/**
 * Обработка маршрута для главной страницы
 */
mainRoutes.get(`/`, (req, res) => res.render(`pages/main`));


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
mainRoutes.get(`/search`, (req, res) => res.render(`pages/search`));


module.exports = mainRoutes;
