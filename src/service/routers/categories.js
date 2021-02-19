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
  router.get(`/`, async (req, res, next) => {
    try {
      const {isWithCount} = req.query;
      const categories = await categoryService.getAll(isWithCount);
      res.status(HttpCode.OK).json(categories);
    } catch (e) {
      next(e);
    }

  });

  return router;
};
