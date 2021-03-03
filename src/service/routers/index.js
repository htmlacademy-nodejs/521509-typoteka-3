'use strict';

const {Router} = require(`express`);

const getArticlesRouter = require(`./articles`);
const getCategoriesRouter = require(`./categories`);
const getSearchRouter = require(`./search`);
const getUsersRouter = require(`./users`);
const getAuthRouter = require(`./auth`);

const {
  ArticleService,
  SearchService,
  CategoryService,
  CommentService,
  UserService
} = require(`../data-services/`);


module.exports = async (db) => {
  const indexRouter = new Router();

  /**
   * Подключаем роутеры, передаем им сервисы
   */
  indexRouter.use(`/articles`, getArticlesRouter(new ArticleService(db), new CommentService(db)));
  indexRouter.use(`/categories`, getCategoriesRouter(new CategoryService(db)));
  indexRouter.use(`/search`, getSearchRouter(new SearchService(db)));
  indexRouter.use(`/users`, getUsersRouter(new UserService(db)));
  indexRouter.use(`/auth`, getAuthRouter(new UserService(db)));

  return indexRouter;
};
