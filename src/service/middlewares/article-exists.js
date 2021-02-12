'use strict';

/**
 * MiddleWare для проверки, что статья существует.
 * Прикрепляет к res.locals найденную статью.
 */

const {HttpCode} = require(`../../consts`);

module.exports = (articleService) => (req, res, next) => {
  const articleId = req.params[`articleId`];

  try {
    res.locals.article = articleService.getOne(articleId);
    next();

  } catch (err) {
    res.status(HttpCode.NOT_FOUND).json({error: {code: HttpCode.NOT_FOUND, message: `Article doesn't exist`, details: err.message}});
  }

};
