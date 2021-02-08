'use strict';

/**
 * Роутер для статей. ('/articles')
 */

const {Router} = require(`express`);

const offersRoutes = new Router();

offersRoutes.get(`/add`, (req, res) => res.send(`/articles/add`));

offersRoutes.get(`/:id`, (req, res) => res.send(`/articles/${req.params.id}`));

offersRoutes.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/${req.params.id}`));

offersRoutes.get(`/category/:id`, (req, res) => res.send(`/articles/category/${req.params.id}`));


module.exports = offersRoutes;
