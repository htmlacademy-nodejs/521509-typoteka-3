'use strict';

/**
 *  Роутер для работы с категориями
 */

const {Router} = require(`express`);
const {HttpCode} = require(`../../consts`);


module.exports = (categoryService) => {
  const router = new Router();

  /**
   * Обработчик корневого пути, отдаем все категории.
   */
  router.get(`/`, (req, res) => {
    const categories = categoryService.getAll();
    res.status(HttpCode.OK).json(categories);
  });

  return router;
};
