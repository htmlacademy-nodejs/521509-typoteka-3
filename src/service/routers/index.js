'use strict';

const path = require(`path`);

const {Router} = require(`express`);

const getArticlesRouter = require(`./articles`);

const MockDataReader = require(`../lib/mock-data-reader`);

/**
 * Название файла для записи результата
 * @const
 * @type {string}
 * @default
 */
const FILE_NAME = `mocks.json`;

/**
 * Относительный путь к корневому каталогу
 * @const
 * @type {string}
 * @default
 */
const PATH_TO_ROOT_FOLDER = `../../../`;


// Модуль временно работает не с сервисами, а с самими данными.
// Сервисы будут добавлены в следующем задании.
module.exports = async () => {
  const indexRouter = new Router();

  const mockData = await new MockDataReader(path.join(__dirname, PATH_TO_ROOT_FOLDER, FILE_NAME)).getData();

  indexRouter.use(`/articles`, getArticlesRouter(mockData));

  return indexRouter;
};
