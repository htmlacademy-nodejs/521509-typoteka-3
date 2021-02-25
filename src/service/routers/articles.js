'use strict';

const {Router} = require(`express`);

const getArticleExistsMiddleware = require(`../middlewares/article-exists`);
const articleValidatorMiddleware = require(`../middlewares/article-validator`);
const getCommentExistsMiddleWare = require(`../middlewares/comment-exists`);
const commentValidatorMiddleWare = require(`../middlewares/comment-validator`);

const {HttpCode} = require(`../../consts`);
const {checkAndReturnPositiveNumber} = require(`../../utils`);

module.exports = (articleService, commentService) => {
  const router = new Router();


  router.get(`/`, async (req, res, next) => {
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


  router.get(`/:articleId`, getArticleExistsMiddleware(articleService), (req, res) => {
    const {article} = res.locals;

    res.status(HttpCode.OK).json(article);
  });


  router.post(`/`, articleValidatorMiddleware, async (req, res, next) => {
    try {
      let newArticle = req.body;
      newArticle = await articleService.add(newArticle);

      res.status(HttpCode.CREATED).json(newArticle);
    } catch (e) {
      next(e);
    }

  });


  router.put(`/:articleId`, [getArticleExistsMiddleware(articleService), articleValidatorMiddleware], async (req, res, next) => {
    try {
      let updatedArticle = req.body;
      updatedArticle = await articleService.update(req.params[`articleId`], updatedArticle);

      res.status(HttpCode.OK).json(updatedArticle);
    } catch (e) {
      next(e);
    }
  });


  router.delete(`/:articleId`, getArticleExistsMiddleware(articleService), async (req, res, next) => {
    try {
      await articleService.delete(req.params[`articleId`]);

      res.status(HttpCode.DELETED).send();
    } catch (e) {
      next(e);
    }
  });


  router.get(`/:articleId/comments`, getArticleExistsMiddleware(articleService), async (req, res, next) => {
    try {
      const comments = await commentService.getAll(req.params[`articleId`]);

      res.status(HttpCode.OK).json(comments);
    } catch (e) {
      next(e);
    }
  });


  router.post(`/:articleId/comments`, [getArticleExistsMiddleware(articleService), commentValidatorMiddleWare], async (req, res, next) => {
    try {
      let newComment = req.body;
      newComment = await commentService.add(req.params[`articleId`], newComment);

      res.status(HttpCode.CREATED).json(newComment);
    } catch (e) {
      next(e);
    }
  });


  router.delete(`/:articleId/comments/:commentId`, [getArticleExistsMiddleware(articleService), getCommentExistsMiddleWare(commentService)], async (req, res, next) => {
    try {
      await commentService.delete(req.params[`commentId`]);

      res.status(HttpCode.DELETED).send();
    } catch (e) {
      next(e);
    }
  });

  return router;
};
