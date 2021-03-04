'use strict';

const {Router} = require(`express`);

const getArticleExistsMiddleware = require(`../middlewares/article-exists`);
const getCommentExistsMiddleWare = require(`../middlewares/comment-exists`);
const getValidatorMiddleware = require(`../middlewares/validator`);
const getIdCheckerMiddleware = require(`../middlewares/id-checker`);
const checkJWTMiddleware = require(`../middlewares/check-jwt`);
const isAuthorMiddleware = require(`../middlewares/check-author`);

const articleValidationSchema = require(`../validation-schemas/article`);
const commentValidationSchema = require(`../validation-schemas/comment`);

const {HttpCode} = require(`../../consts`);
const {checkAndReturnPositiveNumber} = require(`../../utils`);

module.exports = (articleService, commentService) => {
  const router = new Router();


  router.get(`/`,
      async (req, res, next) => {
        try {
          const {isWithComments, page, categoryId} = req.query;

          /**
           * Пытаемся понять, была ли передана страница, если нет, то возвращаем первую страницу по умолчанию
           */
          const currentPage = checkAndReturnPositiveNumber(page, 1);

          let result;

          if (+categoryId || +categoryId < 0) {
            result = await articleService.getByCategory({isWithComments, currentPage, categoryId});
          } else {
            result = await articleService.getAll({isWithComments, currentPage});
          }

          res.status(HttpCode.OK).json(result);
        } catch (e) {
          next(e);
        }
      });

  router.get(`/author/`,
      [
        checkJWTMiddleware,
        isAuthorMiddleware
      ],
      async (req, res, next) => {
        try {
          const {isWithComments, page} = req.query;

          /**
         * Пытаемся понять, была ли передана страница, если нет, то возвращаем первую страницу по умолчанию
         */
          const currentPage = checkAndReturnPositiveNumber(page, 1);

          let result = await articleService.getAll({isWithComments, currentPage, isForAdmin: true});

          res.status(HttpCode.OK).json(result);
        } catch (e) {
          next(e);
        }
      });

  router.get(`/most-discussed/`,
      async (req, res, next) => {
        try {
          let result = await articleService.getMostDiscussed();

          res.status(HttpCode.OK).json(result);
        } catch (e) {
          next(e);
        }
      });

  router.get(`/last-comments/`,
      async (req, res, next) => {
        try {
          let result = await commentService.getLast();

          res.status(HttpCode.OK).json(result);
        } catch (e) {
          next(e);
        }
      });

  router.get(`/:articleId`,
      [getIdCheckerMiddleware(`articleId`), getArticleExistsMiddleware(articleService)],
      (req, res) => {
        const {article} = res.locals;

        res.status(HttpCode.OK).json(article);
      });


  router.post(`/`,
      [
        getValidatorMiddleware(articleValidationSchema, `Article`),
        checkJWTMiddleware,
        isAuthorMiddleware
      ],
      async (req, res, next) => {
        try {
          let newArticle = req.body;
          newArticle[`user_id`] = res.locals.user.id;
          newArticle = await articleService.add(newArticle);

          res.status(HttpCode.CREATED).json(newArticle);
        } catch (e) {
          next(e);
        }

      });


  router.put(`/:articleId`,
      [
        getIdCheckerMiddleware(`articleId`),
        getValidatorMiddleware(articleValidationSchema, `Article`),
        checkJWTMiddleware,
        isAuthorMiddleware,
        getArticleExistsMiddleware(articleService)
      ],
      async (req, res, next) => {
        try {
          let updatedArticle = req.body;
          updatedArticle[`user_id`] = res.locals.user.id;
          updatedArticle = await articleService.update(req.params[`articleId`], updatedArticle);

          res.status(HttpCode.OK).json(updatedArticle);
        } catch (e) {
          next(e);
        }
      });


  router.delete(`/:articleId`,
      [
        getIdCheckerMiddleware(`articleId`),
        checkJWTMiddleware,
        isAuthorMiddleware,
        getArticleExistsMiddleware(articleService)
      ],
      async (req, res, next) => {
        try {
          await articleService.delete(req.params[`articleId`]);

          res.status(HttpCode.DELETED).send();
        } catch (e) {
          next(e);
        }
      });


  router.get(`/:articleId/comments`,
      [getIdCheckerMiddleware(`articleId`), getArticleExistsMiddleware(articleService)],
      async (req, res, next) => {
        try {
          const comments = await commentService.getAll(req.params[`articleId`]);

          res.status(HttpCode.OK).json(comments);
        } catch (e) {
          next(e);
        }
      });


  router.post(`/:articleId/comments`,
      [
        getIdCheckerMiddleware(`articleId`),
        getValidatorMiddleware(commentValidationSchema, `Comment`),
        checkJWTMiddleware,
        getArticleExistsMiddleware(articleService)
      ], async (req, res, next) => {
        try {
          let newComment = req.body;
          newComment[`user_id`] = res.locals.user.id;
          newComment = await commentService.add(req.params[`articleId`], newComment);

          res.status(HttpCode.CREATED).json(newComment);
        } catch (e) {
          next(e);
        }
      });


  router.delete(`/:articleId/comments/:commentId`,
      [
        getIdCheckerMiddleware(`articleId`, `commentId`),
        checkJWTMiddleware,
        isAuthorMiddleware,
        getArticleExistsMiddleware(articleService),
        getCommentExistsMiddleWare(commentService)
      ], async (req, res, next) => {
        try {
          await commentService.delete(req.params[`commentId`]);

          res.status(HttpCode.DELETED).send();
        } catch (e) {
          next(e);
        }
      });


  return router;
};
