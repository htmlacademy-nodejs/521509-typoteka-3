'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../consts`);

const getArticleExistsMiddleware = require(`../middlewares/article-exists`);
const articleValidatorMiddleware = require(`../middlewares/article-validator`);
const getCommentExistsMiddleWare = require(`../middlewares/comment-exists`);
const commentValidatorMiddleWare = require(`../middlewares/comment-validator`);


module.exports = (articleService, commentService) => {
  const router = new Router();


  router.get(`/`, async (req, res, next) => {
    try {
      const {isWithComments, page} = req.query;

      // проверка страницы
      let currentPage = +page;
      if (!currentPage || currentPage < 0) {
        currentPage = 1;
      }

      const result = await articleService.getAll({isWithComments, currentPage});
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
