'use strict';

const path = require(`path`);

const {Router} = require(`express`);

const getArticlesRouter = require(`./articles`);
const getCategoriesRouter = require(`./categories`);
const getSearchRouter = require(`./search`);

const MockDataReader = require(`../lib/mock-data-reader`);

const {
  ArticleService,
  SearchService,
  CategoryService,
  CommentService
} = require(`../data-services/`);

/**
 * Название файла для записи результата
 * @const
 * @type {string}
 * @default `mocks.json`
 */
const FILE_NAME = `mocks.json`;

/**
 * Относительный путь к корневому каталогу
 * @const
 * @type {string}
 * @default `../../../`
 */
const PATH_TO_ROOT_FOLDER = `../../../`;


module.exports = async () => {
  const indexRouter = new Router();

  /**
   * Получаем данные с моками
   */
  const mockArticles = await new MockDataReader(path.join(__dirname, PATH_TO_ROOT_FOLDER, FILE_NAME)).getData();

  /**
   * Подключаем роутеры, передаем им сервисы
   */
  indexRouter.use(`/articles`, getArticlesRouter(new ArticleService(mockArticles), new CommentService()));
  indexRouter.use(`/categories`, getCategoriesRouter(new CategoryService(mockArticles)));
  indexRouter.use(`/search`, getSearchRouter(new SearchService(mockArticles)));

  return indexRouter;
};
