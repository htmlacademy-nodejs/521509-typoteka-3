'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../consts`);


// Модуль временно получает не сервис со статьями, а массив со статьями.
// Сервис будет добавлен в следующем задании.
module.exports = (articles) => {
  const articlesRouter = new Router();

  articlesRouter.get(`/`, (req, res) => {
    res.status(HttpCode.OK).send(articles);
  });

  return articlesRouter;
};
