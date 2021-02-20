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

  router.post(`/`, async (req, res, next) => {
    try {
      // Валидация будет добавлена в следующем модуле
      const categoryData = req.body;
      const categories = await categoryService.add(categoryData);
      res.status(HttpCode.CREATED).json(categories);
    } catch (e) {
      next(e);
    }
  });

  router.put(`/:categoryId`, async (req, res, next) => {
    try {
      const categoryData = req.body;
      const categoryId = req.params[`categoryId`];
      const categories = await categoryService.update(categoryId, categoryData);
      res.status(HttpCode.OK).json(categories);
    } catch (e) {
      next(e);
    }
  });

  router.delete(`/:categoryId`, async (req, res, next) => {
    try {
      const categoryId = req.params[`categoryId`];
      await categoryService.delete(categoryId);
      res.status(HttpCode.DELETED).send();
    } catch (e) {
      next(e);
    }
  });

  return router;
};
