'use strict';

/**
 *  Роутер для работы с категориями
 */

const {Router} = require(`express`);

const getValidatorMiddleware = require(`../middlewares/validator`);
const getCheckUninuqueCategoryMiddleware = require(`../middlewares/check-unique-category`);
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
      let {isWithCount} = req.query;
      isWithCount = isWithCount === `true`;
      const categories = await categoryService.getAll(isWithCount);
      res.status(HttpCode.OK).json(categories);
    } catch (error) {
      next(error);
    }
  });

  router.post(`/`,
      [
        getValidatorMiddleware(categoryValidationSchema, `Category`),
        getCheckUninuqueCategoryMiddleware(categoryService),
        checkJWTMiddleware,
        isAuthorMiddleware
      ],
      async (req, res, next) => {
        try {
          // Валидация будет добавлена в следующем модуле
          const categoryData = req.body;
          const categories = await categoryService.add(categoryData);
          res.status(HttpCode.CREATED).json(categories);
        } catch (error) {
          next(error);
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
        } catch (error) {
          next(error);
        }
      });

  router.delete(`/:categoryId`,
      [
        getIdCheckerMiddleware(`categoryId`),
        checkJWTMiddleware,
        isAuthorMiddleware
      ],
      async (req, res) => {
        try {
          const categoryId = req.params[`categoryId`];
          await categoryService.delete(categoryId);
          res.status(HttpCode.DELETED).send();
        } catch (error) {
          res.status(HttpCode.BAD_REQUEST).json({error: {code: HttpCode.BAD_REQUEST, message: `Can't delete category.`, details: [error.message]}});
        }
      });

  return router;
};
