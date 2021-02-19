'use strict';

const {Router} = require(`express`);

const getArticlesRouter = require(`./articles`);
const getCategoriesRouter = require(`./categories`);
const getSearchRouter = require(`./search`);

const {
  ArticleService,
  SearchService,
  CategoryService,
  CommentService
} = require(`../data-services/`);


module.exports = async (db) => {
  const indexRouter = new Router();

  /**
   * Подключаем роутеры, передаем им сервисы
   */
  indexRouter.use(`/articles`, getArticlesRouter(new ArticleService(db), new CommentService(db)));
  indexRouter.use(`/categories`, getCategoriesRouter(new CategoryService(db)));
  indexRouter.use(`/search`, getSearchRouter(new SearchService(db)));

  return indexRouter;
};
