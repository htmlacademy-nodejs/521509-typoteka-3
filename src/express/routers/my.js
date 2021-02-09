'use strict';

/**
 * Роутер для личного кабинета. ('/my')
 *
 * @module /src/express/routes/my-routes
 */

const {Router} = require(`express`);

const myRoutes = new Router();

myRoutes.get(`/`, (req, res) => res.send(`/my`));
myRoutes.get(`/comments`, (req, res) => res.send(`/my/comments `));

module.exports = myRoutes;
