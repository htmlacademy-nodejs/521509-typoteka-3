'use strict';

/**
 *  Роутер для работы с категориями
 */

const {Router} = require(`express`);

const getValidatorMiddleware = require(`../middlewares/validator`);
const getIdCheckerMiddleware = require(`../middlewares/id-checker`);
const checkJWTMiddleware = require(`../middlewares/check-jwt`);
const isAuthorMiddleware = require(`../middlewares/check-author`);

const categoryValidationSchema = require(`../validation-schemas/category`);

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

  router.post(`/`,
      [
        getValidatorMiddleware(categoryValidationSchema, `Category`),
        checkJWTMiddleware,
        isAuthorMiddleware
      ],
      async (req, res, next) => {
        try {
          // Валидация будет добавлена в следующем модуле
          const categoryData = req.body;
          const categories = await categoryService.add(categoryData);
          res.status(HttpCode.CREATED).json(categories);
        } catch (e) {
          next(e);
        }
      });

  router.put(`/:categoryId`,
      [
        getIdCheckerMiddleware(`categoryId`),
        getValidatorMiddleware(categoryValidationSchema, `Category`),
        checkJWTMiddleware,
        isAuthorMiddleware
      ],
      async (req, res, next) => {
        try {
          const categoryData = req.body;
          const categoryId = req.params[`categoryId`];
          const categories = await categoryService.update(categoryId, categoryData);
          res.status(HttpCode.OK).json(categories);
        } catch (e) {
          next(e);
        }
      });

  router.delete(`/:categoryId`,
      [
        getIdCheckerMiddleware(`categoryId`),
        checkJWTMiddleware,
        isAuthorMiddleware
      ],
      async (req, res, next) => {
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
