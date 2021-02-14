'use strict';

module.exports = () => {
  const {Router} = require(`express`);
  const api = require(`../api`).getDefaultAPI();
  const Uploader = require(`../lib/uploader`);

  const articlesRoutes = new Router();
  const uploaderMiddleware = new Uploader(`img`).getMiddleware();

  return {api, articlesRoutes, uploaderMiddleware};
};

