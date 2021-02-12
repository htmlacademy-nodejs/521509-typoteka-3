'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../consts`);

const getArticleExistsMiddleware = require(`../middlewares/article-exists`);
const articleValidatorMiddleware = require(`../middlewares/article-validator`);
const getCommentExistsMiddleWare = require(`../middlewares/comment-exists`);
const commentValidatorMiddleWare = require(`../middlewares/comment-validator`);


module.exports = (articleService, commentService) => {
  const router = new Router();


  router.get(`/`, (req, res) => {
    const articles = articleService.getAll();
    res.status(HttpCode.OK).json(articles);
  });


  router.get(`/:articleId`, getArticleExistsMiddleware(articleService), (req, res) => {
    const {article} = res.locals;

    res.status(HttpCode.OK).json(article);
  });


  router.post(`/`, articleValidatorMiddleware, (req, res) => {
    let newArticle = req.body;
    newArticle = articleService.add(newArticle);

    res.status(HttpCode.CREATED).json(newArticle);
  });


  router.put(`/:articleId`, [getArticleExistsMiddleware(articleService), articleValidatorMiddleware], (req, res) => {
    let updatedArticle = req.body;
    updatedArticle = articleService.update(req.params[`articleId`], updatedArticle);

    res.status(HttpCode.OK).json(updatedArticle);
  });


  router.delete(`/:articleId`, getArticleExistsMiddleware(articleService), (req, res) => {
    articleService.delete(req.params[`articleId`]);

    res.status(HttpCode.DELETED).send();
  });


  router.get(`/:articleId/comments`, getArticleExistsMiddleware(articleService), (req, res) => {
    const article = articleService.getOne(req.params[`articleId`]);

    res.status(HttpCode.OK).json(commentService.getAll(article));
  });


  router.post(`/:articleId/comments`, [getArticleExistsMiddleware(articleService), commentValidatorMiddleWare], (req, res) => {
    let newComment = req.body;
    const {article} = res.locals;
    newComment = commentService.add(article, newComment);

    res.status(HttpCode.CREATED).json(newComment);
  });


  router.delete(`/:articleId/comments/:commentId`, [getArticleExistsMiddleware(articleService), getCommentExistsMiddleWare(commentService)], (req, res) => {
    const {article} = res.locals;
    commentService.delete(article, req.params[`commentId`]);

    res.status(HttpCode.DELETED).send();
  });

  return router;
};
