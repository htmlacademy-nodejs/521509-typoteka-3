'use strict';

module.exports = () => {
  const {Router} = require(`express`);
  const api = require(`../api`).getDefaultAPI();
  const Uploader = require(`../lib/uploader`);

  const articlesRoutes = new Router();
  const uploaderMiddleware = new Uploader(`img`).getMiddleware();

  const checkUserAuthMiddleware = require(`../middlewares/check-user-auth`);
  const checkUserIsAuthorMiddleware = require(`../middlewares/check-author`);

  return {api, articlesRoutes, uploaderMiddleware, checkUserAuthMiddleware, checkUserIsAuthorMiddleware};
};

